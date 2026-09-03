const API_URL = import.meta.env.VITE_API_URL;

// ========================================
// REFRESH STATE
// ========================================

// Stores the currently running refresh request.
//
// If multiple API requests receive 401 at the
// same time, they will share this Promise instead
// of sending multiple refresh requests.
let refreshPromise = null;


// ========================================
// REFRESH ACCESS TOKEN
// ========================================

const refreshAccessToken = async () => {

  // If refresh is already running,
  // return the existing Promise.
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {

      const refreshResponse = await fetch(
        `${API_URL}/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      // Refresh token is invalid/expired
      if (!refreshResponse.ok) {
        throw new Error("Refresh token expired");
      }

      const refreshData = await refreshResponse.json();

      const newToken = refreshData.token;

      if (!newToken) {
        throw new Error(
          "No access token received",
        );
      }

      // Store new access token
      localStorage.setItem(
        "token",
        newToken,
      );

      return newToken;

    } finally {

      // Allow another refresh request later.
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};


// ========================================
// API REQUEST
// ========================================

export const apiRequest = async (
  endpoint,
  options = {},
) => {

  // Get current access token
  const token = localStorage.getItem("token");


  // ========================================
  // FIRST REQUEST
  // ========================================

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      // Important because refresh token
      // is stored in HttpOnly cookie.
      credentials: "include",

      headers: {
        "Content-Type": "application/json",

        ...(token && {
          Authorization: `Bearer ${token}`,
        }),

        ...options.headers,
      },
    },
  );


  // ========================================
  // AUTH ROUTES
  // ========================================

  // These routes should NEVER trigger
  // access-token refresh.
  //
  // Example:
  //
  // Wrong login credentials
  // /auth/loginUser → 401
  //
  // We should NOT call /auth/refresh.
  const isAuthRoute =
    endpoint === "/auth/loginUser" ||
    endpoint === "/auth/register" ||
    endpoint === "/auth/refresh" ||
    endpoint === "/auth/logout";


  // ========================================
  // ACCESS TOKEN EXPIRED
  // ========================================

  if (
    response.status === 401 &&
    !isAuthRoute
  ) {

    try {

      // ========================================
      // REFRESH ACCESS TOKEN
      // ========================================

      // If another request is already refreshing,
      // this waits for the same Promise.
      const newToken =
        await refreshAccessToken();


      // ========================================
      // RETRY ORIGINAL REQUEST
      // ========================================

      const retryResponse = await fetch(
        `${API_URL}${endpoint}`,
        {
          ...options,

          credentials: "include",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${newToken}`,

            ...options.headers,
          },
        },
      );


      // ========================================
      // RETRY RESPONSE
      // ========================================

      const retryData =
        await retryResponse.json();


      if (!retryResponse.ok) {

        throw new Error(
          retryData.message ||
          "Request failed after token refresh",
        );

      }

      return retryData;

    } catch (error) {

      // ========================================
      // REFRESH FAILED
      // ========================================

      console.error(
        "Session refresh failed:",
        error,
      );

      localStorage.removeItem("token");

      window.location.href = "/login";

      throw new Error(
        "Session expired. Please login again.",
      );
    }
  }


  // ========================================
  // NORMAL RESPONSE
  // ========================================

  const data = await response.json();


  // ========================================
  // NORMAL ERROR
  // ========================================

  if (!response.ok) {

    throw new Error(
      data.message ||
      "Something went wrong",
    );
  }


  // ========================================
  // SUCCESS
  // ========================================

  return data;
};