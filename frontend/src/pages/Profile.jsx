import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import AppNavbar from "../components/AppNavbar";
import ThemePicker from "../components/ThemePicker";
import LayoutPicker from "../components/LayoutPicker";

import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

const EditIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
    <path
      d="M4 12.5V14h1.5l7.3-7.3-1.5-1.5L4 12.5ZM13.7 4.3a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0l-1.1 1.1 3 3 1.1-1.1Z"
      fill="currentColor"
    />
  </svg>
);

const Profile = () => {
  const {
    user,
    setUser,
    fetchProfile,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");

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

      setUser((previousUser) => ({
        ...previousUser,

        profilePicture:
          data.profilePicture,
      }));

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
      <div className="min-h-screen bg-[var(--color-bg)]">
        <AppNavbar />

        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <p className="font-body text-[var(--color-muted)]">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // =========================================
  // NO USER
  // =========================================

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <AppNavbar />

        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <p className="font-body text-[var(--color-muted)]">
            Unable to load profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <AppNavbar />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8">

        <NavLink
          className="mb-6 inline-block text-xs text-[var(--color-primary)] hover:underline"
          to={"/todos"}
        >
          ← Back to todos
        </NavLink>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] lg:gap-14">

          {/* =====================================
              IDENTITY PANEL — a distinct block,
              not another floating white card
          ===================================== */}

          <div className="rounded-3xl bg-[var(--color-surface)] px-6 py-10 text-center lg:sticky lg:top-10 lg:self-start lg:text-left">

            <div className="relative mx-auto w-fit lg:mx-0">
              {preview || user.profilePicture?.url ? (
                <img
                  src={preview || user.profilePicture?.url}
                  alt={user.name}
                  className="h-28 w-28 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[var(--color-primary)] font-display text-3xl font-semibold text-[var(--color-bg)]">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <label className="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-primary)] text-[var(--color-bg)] transition-colors hover:bg-[var(--color-primary-hover)]">
                <EditIcon />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <h1 className="mt-5 font-display text-2xl font-semibold text-[var(--color-text)]">
              {user.name}
            </h1>

            <p className="mt-1 font-body text-sm text-[var(--color-muted)]">
              {user.email}
            </p>

            {selectedFile && (
              <div className="mt-5 border-t border-[var(--color-border)] pt-5">
                <p className="mb-3 truncate font-body text-xs text-[var(--color-muted)]">
                  {selectedFile.name}
                </p>

                <button
                  type="button"
                  onClick={handleAvatarUpload}
                  disabled={uploading}
                  className="w-full rounded-full bg-[var(--color-primary)] px-4 py-2 font-body text-sm font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Save picture"}
                </button>
              </div>
            )}
          </div>

          {/* =====================================
              CONTENT — underline tabs, no card box
          ===================================== */}

          <div>

            <div
              role="tablist"
              aria-label="Profile sections"
              className="flex gap-8 border-b border-[var(--color-border)]"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
                className={`-mb-px border-b-2 pb-3 font-body text-sm font-medium transition-colors ${
                  activeTab === "profile"
                    ? "border-[var(--color-primary)] text-[var(--color-text)]"
                    : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                Profile
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "appearance"}
                onClick={() => setActiveTab("appearance")}
                className={`-mb-px border-b-2 pb-3 font-body text-sm font-medium transition-colors ${
                  activeTab === "appearance"
                    ? "border-[var(--color-primary)] text-[var(--color-text)]"
                    : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                Appearance
              </button>
            </div>

            {/* =====================================
                PROFILE TAB
            ===================================== */}

            <div
              role="tabpanel"
              className={`pt-8 ${activeTab === "profile" ? "block" : "hidden"}`}
            >
              <form onSubmit={handleUpdateProfile} className="max-w-md">
                <div className="mb-6">
                  <label
                    htmlFor="name"
                    className="mb-2 block font-body text-sm font-medium text-[var(--color-text)]"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border-0 border-b border-[var(--color-border)] bg-transparent px-0 py-2 font-body text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)]"
                  />
                </div>

                <div className="mb-8">
                  <label
                    htmlFor="email"
                    className="mb-2 block font-body text-sm font-medium text-[var(--color-text)]"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="w-full cursor-not-allowed border-0 border-b border-[var(--color-border)] bg-transparent px-0 py-2 font-body text-sm text-[var(--color-muted)] outline-none"
                  />

                  <p className="mt-1.5 font-body text-xs text-[var(--color-muted)]">
                    Email cannot currently be changed.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={saving || !name.trim()}
                  className="rounded-full bg-[var(--color-primary)] px-6 py-2.5 font-body text-sm font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </form>

              {message && (
                <p className="mt-5 max-w-md font-body text-sm text-[var(--color-success)]">
                  ✓ {message}
                </p>
              )}

              {error && (
                <p className="mt-5 max-w-md font-body text-sm text-[var(--color-danger)]">
                  {error}
                </p>
              )}
            </div>

            {/* =====================================
                APPEARANCE TAB
            ===================================== */}

            <div
              role="tabpanel"
              className={`pt-8 ${activeTab === "appearance" ? "block" : "hidden"}`}
            >
              <p className="mb-6 max-w-md font-body text-sm text-[var(--color-muted)]">
                These preferences apply across the app and are saved to this
                browser.
              </p>

              <div>
                <h3 className="mb-3 font-body text-sm font-semibold text-[var(--color-text)]">
                  Theme
                </h3>
                <ThemePicker />
              </div>

              <div className="mt-10">
                <h3 className="mb-3 font-body text-sm font-semibold text-[var(--color-text)]">
                  Todo layout
                </h3>
                <LayoutPicker />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;