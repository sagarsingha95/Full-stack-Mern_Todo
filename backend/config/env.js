const requiredEnvVariables = [
  "MONGO_URI",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "FRONTEND_URL",
  "COOKIE_SECURE",
  "COOKIE_SAME_SITE",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const validateEnv = () => {
  const missingVariables = requiredEnvVariables.filter(
    (variable) => !process.env[variable],
  );

  if (missingVariables.length > 0) {
    console.error(
      `Missing required environment variables: ${missingVariables.join(", ")}`,
    );

    process.exit(1);
  }

  // ==========================================
  // NODE ENVIRONMENT
  // ==========================================

  const validEnvironments = ["development", "test", "production"];

  if (!validEnvironments.includes(process.env.NODE_ENV)) {
    console.error(`Invalid NODE_ENV: ${process.env.NODE_ENV}`);

    process.exit(1);
  }

  // ==========================================
  // COOKIE SECURE
  // ==========================================

  if (
    process.env.COOKIE_SECURE !== "true" &&
    process.env.COOKIE_SECURE !== "false"
  ) {
    console.error("COOKIE_SECURE must be either true or false");

    process.exit(1);
  }

  // ==========================================
  // COOKIE SAME SITE
  // ==========================================

  const validSameSiteValues = ["strict", "lax", "none"];

  if (!validSameSiteValues.includes(process.env.COOKIE_SAME_SITE)) {
    console.error("COOKIE_SAME_SITE must be strict, lax, or none");

    process.exit(1);
  }

  // ==========================================
  // PRODUCTION COOKIE SAFETY
  // ==========================================

  if (
    process.env.NODE_ENV === "production" &&
    process.env.COOKIE_SECURE !== "true"
  ) {
    console.error("COOKIE_SECURE must be true in production");

    process.exit(1);
  }

  console.log("Environment variables validated successfully");
};

export default validateEnv;
