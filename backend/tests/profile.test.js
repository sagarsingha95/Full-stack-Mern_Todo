import request from "supertest";
import app from "../app.js";
import User from "../modals/User.js";

describe("User Profile API", () => {
  let token;
  let userId;

  const testUser = {
    name: "Sagar",
    email: "sagarprofile@example.com",
    password: "Password123!",
  };

  beforeEach(async () => {
    // Create a user
    const registerResponse = await request(app)
      .post("/auth/register")
      .send(testUser);

    expect(registerResponse.statusCode).toBe(201);

    // Login
    const loginResponse = await request(app)
      .post("/auth/loginUser")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(loginResponse.statusCode).toBe(200);

    token = loginResponse.body.token;

    const user = await User.findOne({
      email: testUser.email,
    });

    userId = user._id.toString();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  // =====================================================
  // GET PROFILE
  // =====================================================

  test("should return the authenticated user's profile", async () => {
    const response = await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.user).toBeDefined();

    expect(response.body.user.name).toBe(testUser.name);

    expect(response.body.user.email).toBe(testUser.email);
  });

  test("should not return the user's password", async () => {
    const response = await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.user.password).toBeUndefined();
  });

  test("should return 401 when no access token is provided", async () => {
    const response = await request(app)
      .get("/users/profile");

    expect(response.statusCode).toBe(401);
  });

  test("should return 401 for an invalid access token", async () => {
    const response = await request(app)
      .get("/users/profile")
      .set(
        "Authorization",
        "Bearer invalid-token"
      );

    expect(response.statusCode).toBe(401);
  });

  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  test("should update the authenticated user's name", async () => {
    const response = await request(app)
      .put("/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Sagar Singha",
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.user.name).toBe(
      "Sagar Singha"
    );

    expect(response.body.user.email).toBe(
      testUser.email
    );
  });

  test("should persist the updated name in the database", async () => {
    await request(app)
      .put("/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Sagar",
      });

    const updatedUser = await User.findById(userId);

    expect(updatedUser.name).toBe("Updated Sagar");
  });

  test("should not return password after updating profile", async () => {
    const response = await request(app)
      .put("/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Sagar Updated",
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.user.password).toBeUndefined();
  });

  test("should reject profile update without a name", async () => {
    const response = await request(app)
      .put("/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.statusCode).toBe(400);
  });

  test("should reject an empty name", async () => {
    const response = await request(app)
      .put("/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "   ",
      });

    expect(response.statusCode).toBe(400);
  });

  test("should prevent unauthenticated profile updates", async () => {
    const response = await request(app)
      .put("/users/profile")
      .send({
        name: "Hacker Name",
      });

    expect(response.statusCode).toBe(401);
  });
});