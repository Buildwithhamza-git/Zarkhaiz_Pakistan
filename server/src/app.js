const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const path  = require("path")

const app = express();

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

module.exports = app;