const express = require("express");
const cors = require("cors");

const routes = require("./routes");

const app = express();

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