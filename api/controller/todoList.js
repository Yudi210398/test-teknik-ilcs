import { validationResult } from "express-validator";
import { pool } from "../init/configurasiPostgree.js";
import HttpError from "../init/http-error.js";

export const getAllTask = async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM Todo");
    if (rows.length === 0) throw new HttpError("Data Tidak Ada", 404);

    res.status(200).json({
      status: 200,
      message: "Berhasil",
      data: rows,
    });
  } catch (err) {
    next(err);
  }
};

export const createTodo = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const error = validationResult(req);

    const queryInput =
      await `INSERT INTO Todo(title, description, statuss) VALUES ($1, $2, $3)`;

    if (!error.isEmpty()) throw new HttpError(error.array()[0 ?? 1].msg, 400);

    await pool.query(queryInput, [title, description, status || "pending"]);

    res.status(200).json({
      status: 200,
      message: "Task created successfully",
      tasks: { title, description, status },
    });
  } catch (err) {
    next(err);
  }
};

export const getIdTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query("SELECT * FROM Todo WHERE id = $1", [id]);
    if (!rows[0]) throw new HttpError("Todo  tidak ditemukan", 404);
    res.status(200).json({
      status: 200,
      rows,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteIdTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query("SELECT * FROM Todo WHERE id = $1", [id]);

    if (!rows[0]) throw new HttpError("Todo  tidak ditemukan", 404);

    await pool.query("DELETE FROM Todo WHERE id = $1", [id]);
    res.status(200).json({
      status: 200,
      message: "Task deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const updateIdTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const { rows } = await pool.query("SELECT * FROM Todo WHERE id = $1", [id]);

    if (!rows[0]) throw new HttpError("Todo  tidak ditemukan", 404);

    await pool.query(
      "UPDATE Todo SET title = $1, description = $2, status = $3 WHERE id = $4",
      [
        title || rows[0].title,
        description || rows[0].description,
        status || rows[0].status,
        id,
      ]
    );

    res.status(200).json({
      status: 200,
      message: "Task updated successfully",

      task: {
        title: title || rows[0].title,
        description: description || rows[0].description,
        status: status || rows[0].status,
      },
    });
  } catch (err) {
    next(err);
  }
};
