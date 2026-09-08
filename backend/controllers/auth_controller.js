import bcrypt from "bcryptjs";
import User from "../modals/User.js";
import jwt from "jsonwebtoken";
import RefreshSession from "../modals/RefreshSession.js";
import refreshCookieOptions from "../config/cookieConfig.js";
import crypto from "crypto";

// ======================================================
// REGISTER USER
// ======================================================

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body ?? {};

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// LOGIN USER
// ======================================================

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ==================================================
    // CREATE REFRESH TOKEN FAMILY
    // ==================================================

    const familyId = crypto.randomUUID();

    // ==================================================
    // ACCESS TOKEN
    // ==================================================

    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    // ==================================================
    // REFRESH TOKEN
    // ==================================================

    const refreshToken = jwt.sign(
      {
        userId: user._id,
        familyId,
        jti: crypto.randomUUID(),
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ==================================================
    // HASH REFRESH TOKEN
    // ==================================================

    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    // ==================================================
    // STORE REFRESH SESSION
    // ==================================================

    await RefreshSession.create({
      user: user._id,

      familyId,

      tokenHash,

      expiresAt: new Date(
        Date.now() +
          7 * 24 * 60 * 60 * 1000
      ),

      ipAddress: req.ip,

      userAgent: req.get("user-agent"),

      lastUsedAt: new Date(),
    });

    // ==================================================
    // HTTP ONLY COOKIE
    // ==================================================

    res.cookie(
      "refreshToken",
      refreshToken,
      refreshCookieOptions
    );

    return res.status(200).json({
      message: "Login successful",
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// LOGOUT USER
// ======================================================

const logoutUser = async (
  req,
  res,
  next
) => {
  try {
    const token =
      req.cookies.refreshToken;

    if (token) {
      const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      await RefreshSession.findOneAndUpdate(
        {
          tokenHash,
        },
        {
          $set: {
            revoked: true,
            revokedAt: new Date(),
            lastUsedAt: new Date(),
          },
        }
      );
    }

    // IMPORTANT:
    // Cookie path/security settings must match
    // the cookie that was originally created.
    res.clearCookie("refreshToken", {
      httpOnly:
        refreshCookieOptions.httpOnly,

      secure:
        refreshCookieOptions.secure,

      sameSite:
        refreshCookieOptions.sameSite,

      path:
        refreshCookieOptions.path,
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// REFRESH TOKEN
// ======================================================

const refreshToken = async (
  req,
  res,
  next
) => {
  try {
    const token =
      req.cookies.refreshToken;

    // ==================================================
    // NO REFRESH TOKEN
    // ==================================================

    if (!token) {
      return res.status(401).json({
        message:
          "Refresh token not found",
      });
    }

    // ==================================================
    // VERIFY REFRESH TOKEN
    // ==================================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );

    const {
      userId,
      familyId,
    } = decoded;

    // ==================================================
    // HASH REFRESH TOKEN
    // ==================================================

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // ==================================================
    // FIND SESSION
    // ==================================================

    const session =
      await RefreshSession.findOne({
        tokenHash,
        user: userId,
      });

    // ==================================================
    // SESSION DOES NOT EXIST
    // ==================================================

    if (!session) {
      return res.status(401).json({
        message:
          "Invalid refresh session",
      });
    }

    // ==================================================
    // VALIDATE TOKEN FAMILY
    // ==================================================

    if (
      session.familyId !== familyId
    ) {
      return res.status(401).json({
        message:
          "Invalid refresh token family",
      });
    }

    // ==================================================
    // REFRESH TOKEN REUSE DETECTION
    // ==================================================

    if (session.revoked) {
      if (
        process.env.NODE_ENV !==
        "test"
      ) {
        console.warn(
          `Refresh token reuse detected for user ${userId}`
        );
      }

      // Revoke entire token family
      await RefreshSession.updateMany(
        {
          user: userId,
          familyId:
            session.familyId,
          revoked: false,
        },
        {
          $set: {
            revoked: true,
            revokedAt: new Date(),
          },
        }
      );

      return res.status(401).json({
        message:
          "Refresh token reuse detected. Please login again.",
      });
    }

    // ==================================================
    // CHECK SESSION EXPIRATION
    // ==================================================

    if (
      session.expiresAt <
      new Date()
    ) {
      session.revoked = true;
      session.revokedAt =
        new Date();
      session.lastUsedAt =
        new Date();

      await session.save();

      return res.status(401).json({
        message:
          "Refresh session expired",
      });
    }

    // ==================================================
    // REVOKE CURRENT REFRESH TOKEN
    // ==================================================

    session.revoked = true;
    session.revokedAt =
      new Date();
    session.lastUsedAt =
      new Date();

    await session.save();

    // ==================================================
    // GENERATE NEW ACCESS TOKEN
    // ==================================================

    const newAccessToken =
      jwt.sign(
        {
          userId,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "15m",
        }
      );

    // ==================================================
    // GENERATE NEW REFRESH TOKEN
    // ==================================================

    const newRefreshToken =
      jwt.sign(
        {
          userId,
          familyId,
          jti: crypto.randomUUID(),
        },
        process.env
          .JWT_REFRESH_SECRET,
        {
          expiresIn: "7d",
        }
      );

    // ==================================================
    // HASH NEW REFRESH TOKEN
    // ==================================================

    const newTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    // ==================================================
    // STORE NEW REFRESH SESSION
    // ==================================================

    await RefreshSession.create({
      user: userId,

      familyId,

      tokenHash: newTokenHash,

      expiresAt: new Date(
        Date.now() +
          7 * 24 * 60 * 60 * 1000
      ),

      ipAddress: req.ip,

      userAgent: req.get(
        "user-agent"
      ),

      lastUsedAt: new Date(),
    });

    // ==================================================
    // REPLACE REFRESH COOKIE
    // ==================================================

    res.cookie(
      "refreshToken",
      newRefreshToken,
      refreshCookieOptions
    );

    // ==================================================
    // SEND NEW ACCESS TOKEN
    // ==================================================

    return res.status(200).json({
      token: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// EXPORTS
// ======================================================

export {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
};