import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const {
    user,
    setUser,
    fetchProfile,
  } = useAuth();

  const [name, setName] = useState("");

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // =========================================
  // LOAD PROFILE
  // =========================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const profile =
          user || (await fetchProfile());

        setName(profile.name);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // =========================================
  // KEEP NAME IN SYNC WITH USER
  // =========================================

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  // =========================================
  // UPDATE NAME
  // =========================================

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      setError("");
      setMessage("");

      const data = await apiRequest(
        "/users/profile",
        {
          method: "PUT",

          body: JSON.stringify({
            name,
          }),
        }
      );

      // Update global AuthContext user
      setUser(data.user);

      setMessage(
        "Profile updated successfully."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // SELECT IMAGE
  // =========================================

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Optional frontend validation
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPEG, PNG, and WEBP images are allowed."
      );

      return;
    }

    setError("");

    setSelectedFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setPreview(previewUrl);
  };

  // =========================================
  // CLEAN PREVIEW URL
  // =========================================

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // =========================================
  // UPLOAD AVATAR
  // =========================================

  const handleAvatarUpload = async () => {
    if (!selectedFile) {
      setError(
        "Please select an image."
      );

      return;
    }

    try {
      setUploading(true);

      setError("");
      setMessage("");

      const formData =
        new FormData();

      formData.append(
        "avatar",
        selectedFile
      );

      const data = await apiRequest(
        "/users/profile/avatar",
        {
          method: "POST",
          body: formData,
        }
      );

      // Update global user state
      setUser((previousUser) => ({
        ...previousUser,

        profilePicture:
          data.profilePicture,
      }));

      // Remove temporary preview
      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setSelectedFile(null);
      setPreview("");

      setMessage(
        "Profile picture updated successfully."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="font-body text-ink/60">
          Loading profile...
        </p>
      </div>
    );
  }

  // =========================================
  // NO USER
  // =========================================

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="font-body text-ink/60">
          Unable to load profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper px-4 py-10">
      <div className="mx-auto max-w-xl rounded-2xl border border-moss/50 bg-white p-6 shadow-sm sm:p-8">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-1 font-body text-sm text-ink/50">
              Manage your account details.
            </p>
          </div>

          <Link
            to="/todos"
            className="font-body text-sm text-ink/60 transition-colors hover:text-ink"
          >
            ← Back to todos
          </Link>
        </div>

        {/* =====================================
            AVATAR
        ===================================== */}

        <div className="mb-8 flex flex-col items-center">

          {preview ||
          user.profilePicture?.url ? (
            <img
              src={
                preview ||
                user.profilePicture?.url
              }
              alt={user.name}
              className="h-32 w-32 rounded-full border border-moss/40 object-cover"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-ink font-display text-4xl font-semibold text-paper">
              {user.name
                ?.charAt(0)
                .toUpperCase()}
            </div>
          )}

          <label className="mt-5 cursor-pointer rounded-full border border-ink/25 px-5 py-2.5 font-body text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper">

            Choose Picture

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={
                handleFileChange
              }
              className="hidden"
            />
          </label>

          {selectedFile && (
            <div className="mt-4 text-center">
              <p className="mb-3 font-body text-xs text-ink/50">
                {selectedFile.name}
              </p>

              <button
                type="button"
                onClick={
                  handleAvatarUpload
                }
                disabled={uploading}
                className="rounded-full bg-ink px-5 py-2.5 font-body text-sm font-medium text-paper transition-colors hover:bg-amber-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading
                  ? "Uploading..."
                  : "Upload Picture"}
              </button>
            </div>
          )}
        </div>

        {/* =====================================
            PROFILE FORM
        ===================================== */}

        <form
          onSubmit={
            handleUpdateProfile
          }
        >
          {/* NAME */}

          <div className="mb-5">
            <label
              htmlFor="name"
              className="mb-2 block font-body text-sm font-medium text-ink"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              required
              className="w-full rounded-xl border border-moss/60 bg-white px-4 py-3 font-body text-sm text-ink outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/25"
            />
          </div>

          {/* EMAIL */}

          <div className="mb-6">
            <label
              htmlFor="email"
              className="mb-2 block font-body text-sm font-medium text-ink"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={user.email || ""}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-moss/40 bg-paper px-4 py-3 font-body text-sm text-ink/50"
            />

            <p className="mt-1.5 font-body text-xs text-ink/40">
              Email cannot currently be changed.
            </p>
          </div>

          {/* SAVE */}

          <button
            type="submit"
            disabled={
              saving ||
              !name.trim()
            }
            className="rounded-full bg-ink px-6 py-2.5 font-body text-sm font-medium text-paper transition-colors hover:bg-amber-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </form>

        {/* =====================================
            SUCCESS
        ===================================== */}

        {message && (
          <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <p className="font-body text-sm text-green-700">
              {message}
            </p>
          </div>
        )}

        {/* =====================================
            ERROR
        ===================================== */}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="font-body text-sm text-red-700">
              {error}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;