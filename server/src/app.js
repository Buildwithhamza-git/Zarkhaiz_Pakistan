const express = require("express");
const cors = require("cors");
const routes = require("./routes/authroutes")

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

app.use("/", routes)



module.exports = app;