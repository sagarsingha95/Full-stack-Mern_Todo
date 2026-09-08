import request from "supertest";
import app from "../app.js";
import User from "../modals/User.js";

describe("AUTH API", () => {
  const user = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  };

  // ==========================================
  // REGISTER
  // ==========================================

  describe("POST /auth/register", () => {
    test("should register a new user", async () => {
      const response = await request(app).post("/auth/register").send(user);

      expect(response.statusCode).toBe(201);

      expect(response.body.message).toBe("User registered successfully");

      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user.email).toBe(user.email);
    });

    test("should reject duplicate email", async () => {
      await request(app).post("/auth/register").send(user);
      const response = await request(app).post("/auth/register").send(user);

      expect(response.statusCode).toBe(409);

      expect(response.body.message).toBe("User already exists");
    });

    test("should reject invalid email", async () => {
      const response = await request(app).post("/auth/register").send({
        name: "Another User",
        email: "invalid-email",
        password: "password123",
      });

      expect(response.statusCode).toBe(400);

      expect(response.body.message).toBe("Validation failed");
    });

    test("should reject short password", async () => {
      const response = await request(app).post("/auth/register").send({
        name: "Another User",
        email: "another@example.com",
        password: "123",
      });

      expect(response.statusCode).toBe(400);

      expect(response.body.message).toBe("Validation failed");
    });

    test("should reject missing name", async () => {
      const response = await request(app).post("/auth/register").send({
        email: "another@example.com",
        password: "password123",
      });

      expect(response.statusCode).toBe(400);

      expect(response.body.message).toBe("Validation failed");
    });
  });

  // ==========================================
  // LOGIN
  // ==========================================

  describe("POST /auth/loginUser", () => {
    test("should login with correct credentials", async () => {
      await request(app).post("/auth/register").send(user);

      const response = await request(app).post("/auth/loginUser").send({
        email: user.email,
        password: user.password,
      });

      expect(response.statusCode).toBe(200);

      expect(response.body.message).toBe("Login successful");

      // Access token
      expect(response.body.token).toBeDefined();

      // Refresh token cookie
      expect(response.headers["set-cookie"]).toBeDefined();

      expect(response.headers["set-cookie"][0]).toContain("refreshToken=");
    });

    test("should reject wrong password", async () => {
      const response = await request(app).post("/auth/loginUser").send({
        email: user.email,
        password: "wrongpassword",
      });

      expect(response.statusCode).toBe(401);

      expect(response.body.message).toBe("Invalid email or password");
    });

    test("should reject unknown email", async () => {
      const response = await request(app).post("/auth/loginUser").send({
        email: "doesnotexist@example.com",
        password: "password123",
      });

      expect(response.statusCode).toBe(401);

      expect(response.body.message).toBe("Invalid email or password");
    });

    test("should reject invalid login data", async () => {
      const response = await request(app).post("/auth/loginUser").send({
        email: "invalid",
        password: "",
      });

      expect(response.statusCode).toBe(400);

      expect(response.body.message).toBe("Validation failed");
    });
  });
});
