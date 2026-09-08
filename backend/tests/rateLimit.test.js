import request from "supertest";
import app from "../app.js";

describe("RATE LIMIT API", () => {

  // ======================================================
  // LOGIN RATE LIMIT
  // ======================================================

  describe("Login rate limiter", () => {

    test("should block excessive login attempts", async () => {

      let blocked = false;

      for (let i = 0; i < 6; i++) {

        const response = await request(app)
          .post("/auth/loginUser")
          .send({
            email: "unknown@example.com",
            password: "wrongpassword",
          });

        if (response.statusCode === 429) {
          blocked = true;
          break;
        }
      }

      expect(blocked).toBe(true);

    });

  });


  // ======================================================
  // REGISTER RATE LIMIT
  // ======================================================

  describe("Register rate limiter", () => {

    test("should eventually block excessive registration attempts", async () => {

      let blocked = false;

      for (let i = 0; i < 11; i++) {

        const response = await request(app)
          .post("/auth/register")
          .send({
            name: `Test User ${i}`,
            email: `rate${i}@example.com`,
            password: "password123",
          });

        if (response.statusCode === 429) {
          blocked = true;
          break;
        }
      }

      expect(blocked).toBe(true);

    });

  });


  // ======================================================
  // REFRESH RATE LIMIT
  // ======================================================

  describe("Refresh rate limiter", () => {

    test("should block excessive refresh requests", async () => {

      let blocked = false;

      for (let i = 0; i < 31; i++) {

        const response = await request(app)
          .post("/auth/refresh");

        if (response.statusCode === 429) {
          blocked = true;
          break;
        }
      }

      expect(blocked).toBe(true);

    });

  });

});