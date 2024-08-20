import { body } from "express-validator";

export const valdasiTodo = () => {
  return [
    body("title").notEmpty().withMessage("Title harus diisi").trim(),
    body("description")
      .notEmpty()
      .withMessage("description harus diisi")
      .trim(),
  ];
};
