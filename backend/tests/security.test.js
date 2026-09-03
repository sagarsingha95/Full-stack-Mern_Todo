import request from "supertest";
import app from "../app.js";

describe("RATE LIMIT API", () => {

  // ======================================================
  // LOGIN RATE LIMIT
  // ======================================================

  describe("Login rate limiter", () => {

    test("should block excessive login attempts", async () => {

      const requests = [];

      for (let i = 0; i < 3; i++) {
        requests.push(
          request(app)
            .post("/auth/loginUser")
            .send({
              email: "unknown@example.com",
              password: "wrongpassword",
            })
        );
      }

      const responses = await Promise.all(requests);

      const statusCodes = responses.map(
        (response) => response.statusCode
      );

      expect(statusCodes).toContain(429);
    });

  });


  // ======================================================
  // REGISTER RATE LIMIT
  // ======================================================

  describe("Register rate limiter", () => {

    test("should eventually block excessive registration attempts", async () => {

      const requests = [];

      for (let i = 0; i < 11; i++) {
        requests.push(
          request(app)
            .post("/auth/register")
            .send({
              name: `Test User ${i}`,
              email: `rate${i}@example.com`,
              password: "password123",
            })
        );
      }

      const responses = await Promise.all(requests);

      const statusCodes = responses.map(
        (response) => response.statusCode
      );

      expect(statusCodes).toContain(429);
    });

  });


  // ======================================================
  // REFRESH RATE LIMIT
  // ======================================================

  describe("Refresh rate limiter", () => {

    test("should block excessive refresh requests", async () => {

      const requests = [];

      for (let i = 0; i < 31; i++) {
        requests.push(
          request(app)
            .post("/auth/refresh")
        );
      }

      const responses = await Promise.all(requests);

      const statusCodes = responses.map(
        (response) => response.statusCode
      );

      expect(statusCodes).toContain(429);
    });

  });

});