const express = require("express");
const cors = require("cors");
const path = require("path");

const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const { notFoundHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;