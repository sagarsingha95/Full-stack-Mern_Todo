import rateLimit, {
  ipKeyGenerator,
  MemoryStore,
} from "express-rate-limit";

// ======================================================
// KEYS
// ======================================================

const getIpKey = (req) => {
  if (
    process.env.NODE_ENV === "test" &&
    req.headers["x-test-client"]
  ) {
    return `test:${req.headers["x-test-client"]}`;
  }

  return ipKeyGenerator(req.ip);
};

const getLoginKey = (req) => {
  const ip = getIpKey(req);

  const email =
    req.body?.email
      ?.trim()
      ?.toLowerCase() || "unknown";

  return `${ip}:${email}`;
};

// ======================================================
// STORES
// ======================================================

const loginStore = new MemoryStore();
const loginIpStore = new MemoryStore();

const registerStore = new MemoryStore();
const refreshStore = new MemoryStore();

// ======================================================
// LOGIN — PER IP + EMAIL
// ======================================================

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 5,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    message:
      "Too many login attempts for this account. Please try again later.",
  },

  keyGenerator: getLoginKey,

  store: loginStore,

  // Successful logins do not consume the failed-login allowance
  skipSuccessfulRequests: true,
});

// ======================================================
// LOGIN — OVERALL IP PROTECTION
// ======================================================

const loginIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 30,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    message:
      "Too many login requests from this network. Please try again later.",
  },

  keyGenerator: getIpKey,

  store: loginIpStore,
});

// ======================================================
// REGISTER
// ======================================================

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,

  limit: 10,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    message:
      "Too many registration attempts. Please try again later.",
  },

  keyGenerator: getIpKey,

  store: registerStore,
});

// ======================================================
// REFRESH
// ======================================================

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 30,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    message:
      "Too many refresh attempts. Please try again later.",
  },

  keyGenerator: getIpKey,

  store: refreshStore,
});

// ======================================================
// TEST RESET
// ======================================================

const resetRateLimiters = async () => {
  await Promise.all([
    loginStore.resetAll(),
    loginIpStore.resetAll(),
    registerStore.resetAll(),
    refreshStore.resetAll(),
  ]);
};

export {
  loginLimiter,
  loginIpLimiter,
  registerLimiter,
  refreshLimiter,
  resetRateLimiters,
};