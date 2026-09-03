import request from "supertest";
import app from "../app.js";

describe("TODO QUERY VALIDATION", () => {

  const user = {
    name: "Query User",
    email: "query@example.com",
    password: "password123",
  };

  let token;

  beforeEach(async () => {

    await request(app)
      .post("/auth/register")
      .send(user);

    const response = await request(app)
      .post("/auth/loginUser")
      .send({
        email: user.email,
        password: user.password,
      });

    token = response.body.token;
  });


  // ==========================================
  // PAGE
  // ==========================================

  test("should reject page less than 1", async () => {

    const response = await request(app)
      .get("/todos?page=0")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);

    expect(response.body.message)
      .toBe("Invalid query parameters");
  });


  test("should reject non-integer page", async () => {

    const response = await request(app)
      .get("/todos?page=abc")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
  });


  test("should reject decimal page", async () => {

    const response = await request(app)
      .get("/todos?page=1.5")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
  });


  // ==========================================
  // LIMIT
  // ==========================================

  test("should reject limit less than 1", async () => {

    const response = await request(app)
      .get("/todos?limit=0")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
  });


  test("should reject limit greater than 50", async () => {

    const response = await request(app)
      .get("/todos?limit=51")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);

    expect(response.body.errors)
      .toContain("Limit cannot exceed 50.");
  });


  test("should reject non-numeric limit", async () => {

    const response = await request(app)
      .get("/todos?limit=abc")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
  });


  // ==========================================
  // STATUS
  // ==========================================

  test("should reject invalid status", async () => {

    const response = await request(app)
      .get("/todos?status=random")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
  });


  // ==========================================
  // SORT
  // ==========================================

  test("should reject invalid sort", async () => {

    const response = await request(app)
      .get("/todos?sort=random")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
  });


  // ==========================================
  // SEARCH
  // ==========================================

  test("should reject search longer than 100 characters", async () => {

    const search = "a".repeat(101);

    const response = await request(app)
      .get(`/todos?search=${search}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
  });


  // ==========================================
  // VALID QUERY
  // ==========================================

  test("should accept valid query parameters", async () => {

    const response = await request(app)
      .get("/todos?page=1&limit=10&search=test&status=pending&sort=newest")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("todos");
    expect(response.body).toHaveProperty("pagination");
    expect(response.body).toHaveProperty("statistics");
  });


  // ==========================================
  // DEFAULT QUERY
  // ==========================================

  test("should accept request without query parameters", async () => {

    const response = await request(app)
      .get("/todos")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.pagination.currentPage)
      .toBe(1);

    expect(response.body.pagination.limit)
      .toBe(6);
  });

});