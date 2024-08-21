/* eslint-disable no-undef */
import {
  getAllTask,
  createTodo,
  getIdTodo,
  updateIdTodo,
  deleteIdTodo,
} from "../api/controller/todoList.js";
import { pool } from "../api/init/configurasiPostgree.js";
import { validationResult } from "express-validator";

jest.mock("./../api/init/configurasiPostgree.js"); // Mocking the database module

jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

describe("GET /tasks", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("GET /task", async () => {
    const mockRows = [
      {
        id: 4,
        title: "Belajar",
        description: "harus bisa aljabar",
        status: "pending",
      },
      {
        id: 6,
        title: "olaraga",
        description: "biar sehat",
        status: "pending",
      },
    ];
    pool.query.mockResolvedValue({ rows: mockRows });

    await getAllTask(req, res, next);
    console.log(mockRows, `lers`);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      message: "Task created successfully",
      data: mockRows,
    });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("POST /task", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        title: "Test Title",
        description: "Test Description",
        status: "in-progress",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    validationResult.mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([]),
    });
  });

  test("POST /task", async () => {
    pool.query.mockResolvedValue({});

    await createTodo(req, res, next);

    expect(validationResult).toHaveBeenCalledWith(req);
    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO Todo(title, description, status) VALUES ($1, $2, $3)",
      ["Test Title", "Test Description", "in-progress"]
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      message: "Task created successfully",
      tasks: {
        title: "Test Title",
        description: "Test Description",
        status: "in-progress",
      },
    });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("getIdTodo", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "1" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("GET /task/:id", async () => {
    const mockTodo = { id: 1, task: "Test task" };
    pool.query.mockResolvedValue({ rows: [mockTodo] });

    await getIdTodo(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      rows: [mockTodo],
    });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("deleteIdTodo", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "1" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("Delete task/:id", async () => {
    const mockTodo = { id: 1, task: "Test task" };
    pool.query
      .mockResolvedValueOnce({ rows: [mockTodo] }) // Mock untuk SELECT query
      .mockResolvedValueOnce({}); // Mock untuk DELETE query

    await deleteIdTodo(req, res, next);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM Todo WHERE id = $1",
      [req.params.id]
    );
    expect(pool.query).toHaveBeenCalledWith("DELETE FROM Todo WHERE id = $1", [
      req.params.id,
    ]);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      message: "Task deleted successfully",
    });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("updateIdTodo", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "1" },
      body: {
        title: "Updated title",
        description: "Updated description",
        status: "completed",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("PUT /task/:id", async () => {
    const mockTodo = {
      id: 1,
      title: "Old title",
      description: "Old description",
      status: "pending",
    };
    pool.query
      .mockResolvedValueOnce({ rows: [mockTodo] }) // Mock untuk SELECT query
      .mockResolvedValueOnce({}); // Mock untuk UPDATE query

    await updateIdTodo(req, res, next);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM Todo WHERE id = $1",
      [req.params.id]
    );
    expect(pool.query).toHaveBeenCalledWith(
      "UPDATE Todo SET title = $1, description = $2, status = $3 WHERE id = $4",
      ["Updated title", "Updated description", "completed", req.params.id]
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      message: "Task updated successfully",
      task: {
        title: "Updated title",
        description: "Updated description",
        status: "completed",
      },
    });
    expect(next).not.toHaveBeenCalled();
  });
});
