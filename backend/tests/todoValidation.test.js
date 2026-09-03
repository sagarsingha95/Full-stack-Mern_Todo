import request from "supertest";
import app from "../app.js";

describe("TODO VALIDATION", () => {

  const user = {
    name: "Validation User",
    email: "validation@example.com",
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
  // TITLE
  // ==========================================

  test("should reject title shorter than 2 characters", async () => {

    const response = await request(app)
      .post("/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "A",
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.message)
      .toBe("Validation failed");
  });


  test("should reject title longer than 100 characters", async () => {

    const response = await request(app)
      .post("/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "A".repeat(101),
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.message)
      .toBe("Validation failed");
  });


  test("should reject non-string title", async () => {

    const response = await request(app)
      .post("/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: 123,
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.message)
      .toBe("Validation failed");
  });


  // ==========================================
  // DESCRIPTION
  // ==========================================

  test("should reject description longer than 500 characters", async () => {

    const response = await request(app)
      .post("/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Valid Todo",
        description: "A".repeat(501),
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.message)
      .toBe("Validation failed");
  });


  // ==========================================
  // PRIORITY
  // ==========================================

  test("should reject invalid priority", async () => {

    const response = await request(app)
      .post("/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Valid Todo",
        priority: "urgent",
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.message)
      .toBe("Validation failed");
  });


  // ==========================================
  // COMPLETED
  // ==========================================

  test("should reject non-boolean completed value", async () => {

    const response = await request(app)
      .post("/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Valid Todo",
        completed: "true",
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.message)
      .toBe("Validation failed");
  });


  // ==========================================
  // DUE DATE
  // ==========================================

  test("should reject invalid due date", async () => {

    const response = await request(app)
      .post("/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Valid Todo",
        dueDate: "not-a-date",
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.message)
      .toBe("Validation failed");
  });


  // ==========================================
  // VALID TODO
  // ==========================================

  test("should accept valid todo data", async () => {

    const response = await request(app)
      .post("/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Learn MERN",
        description: "Complete production-ready Todo app",
        priority: "high",
        completed: false,
        dueDate: "2026-12-31",
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.todo).toHaveProperty("_id");

    expect(response.body.todo.title)
      .toBe("Learn MERN");
  });


  // ==========================================
  // INVALID TODO ID
  // ==========================================

  test("should reject invalid todo ID during update", async () => {

    const response = await request(app)
      .put("/todos/not-a-valid-id")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Todo",
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.message)
      .toBe("Invalid todo ID.");
  });


  test("should reject invalid todo ID during delete", async () => {

    const response = await request(app)
      .delete("/todos/not-a-valid-id")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);

    expect(response.body.message)
      .toBe("Invalid todo ID.");
  });


  // ==========================================
  // VALID BUT NONEXISTENT ID
  // ==========================================

  test("should return 404 when updating nonexistent todo", async () => {

    const fakeId = "507f1f77bcf86cd799439011";

    const response = await request(app)
      .put(`/todos/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Todo",
      });

    expect(response.statusCode).toBe(404);

    expect(response.body.message)
      .toBe("Todo not found.");
  });


  test("should return 404 when deleting nonexistent todo", async () => {

    const fakeId = "507f1f77bcf86cd799439011";

    const response = await request(app)
      .delete(`/todos/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);

    expect(response.body.message)
      .toBe("Todo not found");
  });

});