import User from "../modals/User.js";
import cloudinary from "../config/cloudinary.js";

// ======================================================
// GET PROFILE
// ======================================================

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(
      req.user.userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// UPLOAD / CHANGE PROFILE PICTURE
// ======================================================

const uploadProfilePicture = async (
  req,
  res,
  next
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image.",
      });
    }

    const user = await User.findById(
      req.user.userId
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const uploadResult = await new Promise(
      (resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder: "mern-todo/profile-pictures",

              transformation: [
                {
                  width: 500,
                  height: 500,
                  crop: "fill",
                  gravity: "face",
                },
              ],
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

        uploadStream.end(req.file.buffer);
      }
    );

    // Delete previous profile image
    if (user.profilePicture?.publicId) {
      await cloudinary.uploader.destroy(
        user.profilePicture.publicId
      );
    }

    user.profilePicture = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };

    await user.save();

    return res.status(200).json({
      message:
        "Profile picture updated successfully",

      profilePicture: user.profilePicture,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        name: name.trim(),
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getProfile,
  uploadProfilePicture,
};