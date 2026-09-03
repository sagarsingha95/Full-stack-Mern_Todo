// rateLimitMiddleware.js
import rateLimit, {
  ipKeyGenerator,
  MemoryStore,
} from "express-rate-limit";

// ======================================================
// RATE-LIMIT KEY
// ======================================================

const getRateLimitKey = (req) => {
  if (process.env.NODE_ENV === "test" && req.headers["x-test-client"]) {
    return `test:${req.headers["x-test-client"]}`;
  }
  return ipKeyGenerator(req.ip);
};

// ======================================================
// DEDICATED STORES (so we can reset them between tests)
// ======================================================

const loginStore = new MemoryStore();
const registerStore = new MemoryStore();
const refreshStore = new MemoryStore();

// ======================================================
// LOGIN RATE LIMITER
// ======================================================

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 2,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
  keyGenerator: getRateLimitKey,
  store: loginStore,
});

// ======================================================
// REGISTER RATE LIMITER
// ======================================================

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many registration attempts. Please try again later." },
  keyGenerator: getRateLimitKey,
  store: registerStore,
});

// ======================================================
// REFRESH TOKEN RATE LIMITER
// ======================================================

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many refresh attempts. Please try again later." },
  keyGenerator: getRateLimitKey,
  store: refreshStore,
});

// ======================================================
// RESET RATE LIMITERS
// ======================================================
//
// Called in tests/setup.js's afterEach. Wipes all limiter counts
// so one test's requests never bleed into the next test's assertions —
// while still allowing a single test to legitimately trip a real 429
// by firing enough requests before this runs.
// ======================================================

const resetRateLimiters = async () => {
  await Promise.all([
    loginStore.resetAll(),
    registerStore.resetAll(),
    refreshStore.resetAll(),
  ]);
};

export {
  loginLimiter,
  registerLimiter,
  refreshLimiter,
  resetRateLimiters,
};