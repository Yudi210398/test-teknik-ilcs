/* eslint-disable no-undef */
import { getAllTask, createTodo } from "../api/controller/todoList.js";
import { pool } from "./../api/init/configurasiPostgree.js";
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

  test("should return 200 and data if rows are found", async () => {
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
      message: "Berhasil",
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

  test("bikin data", async () => {
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
