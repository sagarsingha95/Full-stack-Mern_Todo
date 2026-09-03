const API_URL = import.meta.env.VITE_API_URL;


// ========================================
// REFRESH STATE
// ========================================

let refreshPromise = null;


// ========================================
// REFRESH ACCESS TOKEN
// ========================================

const refreshAccessToken = async () => {
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

      if (!refreshResponse.ok) {
        throw new Error("Refresh token expired");
      }

      const refreshData =
        await refreshResponse.json();

      const newToken = refreshData.token;

      if (!newToken) {
        throw new Error(
          "No access token received",
        );
      }

      localStorage.setItem(
        "token",
        newToken,
      );

      return newToken;

    } finally {
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

  const token =
    localStorage.getItem("token");

  // Check whether we're sending FormData
  const isFormData =
    options.body instanceof FormData;


  // ========================================
  // FIRST REQUEST
  // ========================================

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      credentials: "include",

      headers: {

        // Only add application/json
        // when the request is NOT FormData.
        ...(!isFormData && {
          "Content-Type": "application/json",
        }),

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

            // Same FormData handling
            // is required on the retry.
            ...(!isFormData && {
              "Content-Type": "application/json",
            }),

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

  const data =
    await response.json();


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