const express = require("express");
const cors = require("cors");
const routes = require("./routes/authroutes")

const app = express();

app.use(cors());

app.use(express.json());

app.use("/",routes )



app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

module.exports = app;