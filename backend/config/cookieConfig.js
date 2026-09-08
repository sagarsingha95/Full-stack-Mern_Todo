const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: process.env.COOKIE_SAME_SITE || "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/auth",
};

export default refreshCookieOptions;