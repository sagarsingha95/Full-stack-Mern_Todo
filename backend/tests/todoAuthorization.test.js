import request from "supertest";
import app from "../app.js";

import Todo from "../modals/Todo_modal.js";
import User from "../modals/User.js";

describe("TODO AUTHORIZATION", () => {

  const userA = {
    name: "User A",
    email: "usera@example.com",
    password: "password123",
  };

  const userB = {
    name: "User B",
    email: "userb@example.com",
    password: "password123",
  };

    beforeEach(async () => {
    await Todo.deleteMany({});
    await User.deleteMany({});
  });

  // ======================================================
  // HELPER: REGISTER + LOGIN
  // ======================================================

  const createUserAndLogin = async (user) => {

    await request(app)
      .post("/auth/register")
      .send(user);

    const response = await request(app)
      .post("/auth/loginUser")
      .send({
        email: user.email,
        password: user.password,
      });

    return response.body.token;
  };


  // ======================================================
  // USER ISOLATION
  // ======================================================

  describe("GET /todos", () => {

    test("should only return todos belonging to authenticated user", async () => {

      const tokenA = await createUserAndLogin(userA);
      const tokenB = await createUserAndLogin(userB);

      // User A creates a Todo
      const todoAResponse = await request(app)
        .post("/todos")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "User A Todo",
          description: "Private Todo A",
          priority: "high",
        });

      expect(todoAResponse.statusCode)
        .toBe(201);

      // User B creates a Todo
      const todoBResponse = await request(app)
        .post("/todos")
        .set("Authorization", `Bearer ${tokenB}`)
        .send({
          title: "User B Todo",
          description: "Private Todo B",
          priority: "low",
        });

      expect(todoBResponse.statusCode)
        .toBe(201);

      // User A requests todos
      const response = await request(app)
        .get("/todos")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.statusCode)
        .toBe(200);

      expect(response.body.todos)
        .toHaveLength(1);

      expect(response.body.todos[0].title)
        .toBe("User A Todo");

      expect(response.body.todos[0].title)
        .not.toBe("User B Todo");
    });


    test("should return empty todos when user has no todos", async () => {

      const tokenA = await createUserAndLogin(userA);

      const response = await request(app)
        .get("/todos")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.statusCode)
        .toBe(200);

      expect(response.body.todos)
        .toHaveLength(0);

      expect(response.body.pagination.totalTodos)
        .toBe(0);
    });

  });


  // ======================================================
  // UPDATE AUTHORIZATION
  // ======================================================

  describe("PUT /todos/:id", () => {

    test("should allow user to update their own todo", async () => {

      const tokenA = await createUserAndLogin(userA);

      const createResponse = await request(app)
        .post("/todos")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "Original Todo",
          description: "Original description",
          priority: "medium",
        });

      expect(createResponse.statusCode)
        .toBe(201);

      const todoId = createResponse.body.todo._id;

      const updateResponse = await request(app)
        .put(`/todos/${todoId}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "Updated Todo",
          description: "Updated description",
          completed: true,
          priority: "high",
        });

      expect(updateResponse.statusCode)
        .toBe(200);

      expect(updateResponse.body.data.title)
        .toBe("Updated Todo");

      expect(updateResponse.body.data.completed)
        .toBe(true);
    });


    test("should not allow user to update another user's todo", async () => {

      const tokenA = await createUserAndLogin(userA);
      const tokenB = await createUserAndLogin(userB);

      // User A creates Todo
      const createResponse = await request(app)
        .post("/todos")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "User A Private Todo",
          description: "Do not modify",
          priority: "medium",
        });

      expect(createResponse.statusCode)
        .toBe(201);

      const todoId = createResponse.body.todo._id;

      // User B attempts to modify User A's Todo
      const updateResponse = await request(app)
        .put(`/todos/${todoId}`)
        .set("Authorization", `Bearer ${tokenB}`)
        .send({
          title: "HACKED",
          description: "Modified by User B",
          completed: true,
          priority: "high",
        });

      expect(updateResponse.statusCode)
        .toBe(404);

      expect(updateResponse.body.message)
        .toBe("Todo not found.");

      // Verify original Todo was not modified
      const todo = await Todo.findById(todoId);

      expect(todo.title)
        .toBe("User A Private Todo");

      expect(todo.description)
        .toBe("Do not modify");

      expect(todo.completed)
        .toBe(false);
    });

  });


  // ======================================================
  // DELETE AUTHORIZATION
  // ======================================================

  describe("DELETE /todos/:id", () => {

    test("should allow user to delete their own todo", async () => {

      const tokenA = await createUserAndLogin(userA);

      const createResponse = await request(app)
        .post("/todos")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "Todo To Delete",
          description: "Delete this",
          priority: "low",
        });

      expect(createResponse.statusCode)
        .toBe(201);

      const todoId = createResponse.body.todo._id;

      const deleteResponse = await request(app)
        .delete(`/todos/${todoId}`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(deleteResponse.statusCode)
        .toBe(200);

      expect(deleteResponse.body.message)
        .toBe("Todo deleted successfully");

      const deletedTodo = await Todo.findById(todoId);

      expect(deletedTodo)
        .toBeNull();
    });


    test("should not allow user to delete another user's todo", async () => {

      const tokenA = await createUserAndLogin(userA);
      const tokenB = await createUserAndLogin(userB);

      // User A creates Todo
      const createResponse = await request(app)
        .post("/todos")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "User A Todo",
          description: "Must remain",
          priority: "high",
        });

      expect(createResponse.statusCode)
        .toBe(201);

      const todoId = createResponse.body.todo._id;

      // User B attempts to delete User A's Todo
      const deleteResponse = await request(app)
        .delete(`/todos/${todoId}`)
        .set("Authorization", `Bearer ${tokenB}`);

      expect(deleteResponse.statusCode)
        .toBe(404);

      expect(deleteResponse.body.message)
        .toBe("Todo not found");

      // Verify Todo still exists
      const todo = await Todo.findById(todoId);

      expect(todo)
        .not.toBeNull();

      expect(todo.title)
        .toBe("User A Todo");
    });

  });

});