import request from "supertest";
import crypto from "crypto";
import app from "../app.js";

import User from "../modals/User.js";
import RefreshSession from "../modals/RefreshSession.js";

describe("REFRESH TOKEN API", () => {
  // ======================================================
  // TEST USER
  // ======================================================

  const user = {
    name: "Refresh Test User",
    email: "refresh@example.com",
    password: "password123",
  };

  // ======================================================
  // TEST CLIENT
  // ======================================================

  let testClient;

  // ======================================================
  // HELPERS
  // ======================================================

  const createUser = async () => {
    const response = await request(app)
      .post("/auth/register")
      .set("x-test-client", testClient)
      .send(user);

    expect(response.statusCode).toBe(201);

    return response;
  };

  const loginUser = async () => {
    const response = await request(app)
      .post("/auth/loginUser")
      .set("x-test-client", testClient)
      .send({
        email: user.email,
        password: user.password,
      });

    expect(response.statusCode).toBe(200);

    return response;
  };

  const getRefreshCookie = (response) => {
    const cookies = response.headers["set-cookie"];

    expect(cookies).toBeDefined();

    const refreshCookie = cookies.find((cookie) =>
      cookie.startsWith("refreshToken=")
    );

    expect(refreshCookie).toBeDefined();

    return refreshCookie;
  };

  const getRefreshToken = (cookie) => {
    return cookie.split(";")[0].split("=")[1];
  };

  const hashToken = (token) => {
    return crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
  };

  const getSessionByCookie = async (cookie) => {
    const refreshToken = getRefreshToken(cookie);
    const tokenHash = hashToken(refreshToken);

    return RefreshSession.findOne({
      tokenHash,
    });
  };

  // ======================================================
  // TEST DATABASE ISOLATION
  // ======================================================

  beforeEach(async () => {
    await RefreshSession.deleteMany({});
    await User.deleteMany({});

    // Give every test its own rate-limit identity
    testClient = crypto.randomUUID();
  });

  // ======================================================
  // REFRESH TOKEN
  // ======================================================

  describe("POST /auth/refresh", () => {
    // ----------------------------------------------------
    // NO TOKEN
    // ----------------------------------------------------

    test("should reject request without refresh token", async () => {
      const response = await request(app)
        .post("/auth/refresh")
        .set("x-test-client", testClient);

      expect(response.statusCode).toBe(401);

      expect(response.body).toEqual({
        message: "Refresh token not found",
      });
    });

    // ----------------------------------------------------
    // SUCCESSFUL REFRESH
    // ----------------------------------------------------

    test("should refresh access token successfully", async () => {
      await createUser();

      const loginResponse = await loginUser();

      const oldCookie = getRefreshCookie(loginResponse);

      const refreshResponse = await request(app)
        .post("/auth/refresh")
        .set("x-test-client", testClient)
        .set("Cookie", oldCookie);

      expect(refreshResponse.statusCode).toBe(200);

      // New access token should be returned
      expect(refreshResponse.body.token).toBeDefined();
      expect(typeof refreshResponse.body.token).toBe("string");

      // New refresh cookie should be returned
      const newCookie = getRefreshCookie(refreshResponse);

      expect(newCookie).toBeDefined();

      // New refresh token must be different
      expect(getRefreshToken(newCookie)).not.toBe(
        getRefreshToken(oldCookie)
      );
    });

    // ----------------------------------------------------
    // TOKEN ROTATION
    // ----------------------------------------------------

    test("should rotate refresh token and revoke old session", async () => {
      await createUser();

      const loginResponse = await loginUser();

      const oldCookie = getRefreshCookie(loginResponse);

      // Get exact session associated with old token
      const originalSession =
        await getSessionByCookie(oldCookie);

      expect(originalSession).toBeDefined();

      expect(originalSession.revoked).toBe(false);

      const originalFamilyId =
        originalSession.familyId;

      // Refresh
      const refreshResponse = await request(app)
        .post("/auth/refresh")
        .set("x-test-client", testClient)
        .set("Cookie", oldCookie);

      expect(refreshResponse.statusCode).toBe(200);

      // New cookie
      const newCookie =
        getRefreshCookie(refreshResponse);

      // Old and new tokens must be different
      expect(getRefreshToken(newCookie)).not.toBe(
        getRefreshToken(oldCookie)
      );

      // --------------------------------------------------
      // OLD SESSION
      // --------------------------------------------------

      const oldSession =
        await RefreshSession.findById(
          originalSession._id
        );

      expect(oldSession).toBeDefined();

      expect(oldSession.revoked).toBe(true);

      expect(oldSession.revokedAt).toBeDefined();

      expect(oldSession.revokedAt).toBeInstanceOf(Date);

      // --------------------------------------------------
      // NEW SESSION
      // --------------------------------------------------

      const newSession =
        await getSessionByCookie(newCookie);

      expect(newSession).toBeDefined();

      expect(newSession.revoked).toBe(false);

      // New session must belong to same family
      expect(newSession.familyId).toBe(
        originalFamilyId
      );

      // New session must belong to same user
      expect(newSession.user.toString()).toBe(
        originalSession.user.toString()
      );

      // --------------------------------------------------
      // SESSION COUNT
      // --------------------------------------------------

      const sessions =
        await RefreshSession.find({
          user: originalSession.user,
        });

      expect(sessions).toHaveLength(2);
    });

    // ----------------------------------------------------
    // REUSE DETECTION
    // ----------------------------------------------------

    test(
      "should reject reused refresh token and revoke entire token family",
      async () => {
        await createUser();

        const loginResponse = await loginUser();

        const oldCookie =
          getRefreshCookie(loginResponse);

        // --------------------------------------------------
        // FIRST REFRESH
        // --------------------------------------------------

        const firstRefresh =
          await request(app)
            .post("/auth/refresh")
            .set("x-test-client", testClient)
            .set("Cookie", oldCookie);

        expect(firstRefresh.statusCode).toBe(200);

        const newCookie =
          getRefreshCookie(firstRefresh);

        // --------------------------------------------------
        // VERIFY TWO SESSIONS EXIST
        // --------------------------------------------------

        const originalSession =
          await getSessionByCookie(oldCookie);

        const newSession =
          await getSessionByCookie(newCookie);

        expect(originalSession).toBeDefined();

        expect(newSession).toBeDefined();

        expect(originalSession.revoked).toBe(true);

        expect(newSession.revoked).toBe(false);

        expect(originalSession.familyId).toBe(
          newSession.familyId
        );

        // --------------------------------------------------
        // REUSE OLD TOKEN
        // --------------------------------------------------

        const secondRefresh =
          await request(app)
            .post("/auth/refresh")
            .set("x-test-client", testClient)
            .set("Cookie", oldCookie);

        expect(secondRefresh.statusCode).toBe(401);

        expect(secondRefresh.body).toEqual({
          message:
            "Refresh token reuse detected. Please login again.",
        });

        // --------------------------------------------------
        // ENTIRE FAMILY MUST BE REVOKED
        // --------------------------------------------------

        const sessions =
          await RefreshSession.find({
            user: originalSession.user,
            familyId: originalSession.familyId,
          });

        expect(sessions).toHaveLength(2);

        for (const session of sessions) {
          expect(session.revoked).toBe(true);

          expect(session.revokedAt).toBeDefined();

          expect(session.revokedAt).toBeInstanceOf(Date);
        }
      }
    );

    // ----------------------------------------------------
    // INVALID SESSION
    // ----------------------------------------------------

    test(
      "should reject refresh token when session does not exist",
      async () => {
        await createUser();

        const loginResponse = await loginUser();

        const refreshCookie =
          getRefreshCookie(loginResponse);

        // Delete the database session
        await RefreshSession.deleteMany({});

        const response =
          await request(app)
            .post("/auth/refresh")
            .set("x-test-client", testClient)
            .set("Cookie", refreshCookie);

        expect(response.statusCode).toBe(401);

        expect(response.body).toEqual({
          message: "Invalid refresh session",
        });
      }
    );

    // ----------------------------------------------------
    // INVALID REFRESH TOKEN
    // ----------------------------------------------------

    test("should reject an invalid refresh token", async () => {
      const response =
        await request(app)
          .post("/auth/refresh")
          .set("x-test-client", testClient)
          .set(
            "Cookie",
            "refreshToken=invalid-token"
          );

      expect(response.statusCode).toBe(401);
    });
  });

  // ======================================================
  // LOGOUT
  // ======================================================

  describe("POST /auth/logout", () => {
    // ----------------------------------------------------
    // SUCCESSFUL LOGOUT
    // ----------------------------------------------------

    test("should logout and revoke refresh session", async () => {
      await createUser();

      const loginResponse = await loginUser();

      const refreshCookie =
        getRefreshCookie(loginResponse);

      // Get exact session before logout
      const sessionBeforeLogout =
        await getSessionByCookie(refreshCookie);

      expect(sessionBeforeLogout).toBeDefined();

      expect(sessionBeforeLogout.revoked).toBe(false);

      // Logout
      const logoutResponse =
        await request(app)
          .post("/auth/logout")
          .set("x-test-client", testClient)
          .set("Cookie", refreshCookie);

      expect(logoutResponse.statusCode).toBe(200);

      expect(logoutResponse.body).toEqual({
        message: "Logged out successfully",
      });

      // --------------------------------------------------
      // VERIFY SESSION
      // --------------------------------------------------

      const sessionAfterLogout =
        await RefreshSession.findById(
          sessionBeforeLogout._id
        );

      expect(sessionAfterLogout).toBeDefined();

      expect(sessionAfterLogout.revoked).toBe(true);

      expect(sessionAfterLogout.revokedAt).toBeDefined();

      expect(sessionAfterLogout.revokedAt).toBeInstanceOf(
        Date
      );

      // --------------------------------------------------
      // VERIFY COOKIE IS CLEARED
      // --------------------------------------------------

      const cookies =
        logoutResponse.headers["set-cookie"];

      expect(cookies).toBeDefined();

      const clearedCookie = cookies.find((cookie) =>
        cookie.startsWith("refreshToken=")
      );

      expect(clearedCookie).toBeDefined();

      expect(clearedCookie).toContain(
        "refreshToken="
      );

      expect(clearedCookie).toContain(
        "Expires=Thu, 01 Jan 1970"
      );
    });

    // ----------------------------------------------------
    // REFRESH AFTER LOGOUT
    // ----------------------------------------------------

    test("should reject refresh after logout", async () => {
      await createUser();

      const loginResponse = await loginUser();

      const refreshCookie =
        getRefreshCookie(loginResponse);

      // Logout
      const logoutResponse =
        await request(app)
          .post("/auth/logout")
          .set("x-test-client", testClient)
          .set("Cookie", refreshCookie);

      expect(logoutResponse.statusCode).toBe(200);

      // Try using revoked refresh token
      const refreshResponse =
        await request(app)
          .post("/auth/refresh")
          .set("x-test-client", testClient)
          .set("Cookie", refreshCookie);

      expect(refreshResponse.statusCode).toBe(401);

      expect(refreshResponse.body).toEqual({
        message:
          "Refresh token reuse detected. Please login again.",
      });
    });

    // ----------------------------------------------------
    // LOGOUT WITHOUT TOKEN
    // ----------------------------------------------------

    test(
      "should logout successfully without refresh token",
      async () => {
        const response =
          await request(app)
            .post("/auth/logout")
            .set("x-test-client", testClient);

        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
          message: "Logged out successfully",
        });
      }
    );
  });
});