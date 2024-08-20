import bodyParser from "body-parser";
import express from "express";
import * as dotenv from "dotenv";
import routerError from "./api/routers/routersError.js";
import { pool } from "./api/init/configurasiPostgree.js";
import routerTodo from "./api/routers/todoRouter.js";

dotenv.config();

const app = express();
// eslint-disable-next-line
const port = process.env.PORT;

(async () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    next();
  });

  app.use(routerTodo);

  //! Error Middlewere
  app.use(routerError);
  // eslint-disable-next-line
  app.use(async (error, req, res, next) => {
    let pesan;
    let status;
    if (error.statusCode === 500) {
      status = error.statusCode;
      pesan = "server bermasalah / Endpoint tidak ditemukan";
      return res
        .status(status)
        .json({ error: { pesan: `${pesan + " " + status}` } });
    }

    status = error.statusCode || 401;
    pesan = error.message;
    await res
      .status(status)
      .json({ error: { pesan: `${pesan + " " + status}` } });
  });

  pool.connect((err) => {
    if (err) console.log(err, `error`);
    else
      console.log(`konek ke postgres
    `);

    app.listen(3001);
  });
})();
