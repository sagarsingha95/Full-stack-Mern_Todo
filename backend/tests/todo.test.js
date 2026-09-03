import request from "supertest";
import app from "../app.js";

describe("Todo API", () => {

  // ==========================================
  // NO TOKEN
  // ==========================================

  test("should reject access without access token", async () => {

    const response = await request(app)
      .get("/todos");

    expect(response.statusCode).toBe(401);

    expect(response.body.message)
      .toBe("No token provided");
  });


  // ==========================================
  // AUTHENTICATED USER
  // ==========================================

  test("should allow authenticated user to get todos", async () => {

    // Register user
    await request(app)
      .post("/auth/register")
      .send({
        name: "Todo User",
        email: "todo@example.com",
        password: "password123",
      });


    // Login
    const loginResponse = await request(app)
      .post("/auth/loginUser")
      .send({
        email: "todo@example.com",
        password: "password123",
      });


    expect(loginResponse.statusCode)
      .toBe(200);


    const accessToken =
      loginResponse.body.token;


    // Get todos
    const response = await request(app)
      .get("/todos")
      .set(
        "Authorization",
        `Bearer ${accessToken}`
      );


    expect(response.statusCode)
      .toBe(200);


    expect(response.body.todos)
      .toBeDefined();


    expect(
      Array.isArray(response.body.todos)
    ).toBe(true);


    expect(response.body.pagination)
      .toBeDefined();


    expect(response.body.statistics)
      .toBeDefined();

  });

});