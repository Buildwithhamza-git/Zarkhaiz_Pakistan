const express = require("express");
const cors = require("cors");
const routes = require("./routes/authroutes")

const app = express();

app.use(
    cors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                "http://localhost:5173",
                "http://localhost:5174",
            ];

            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use((req, res, next) => {
    if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
        if (typeof req.body === "string") {
            try {
                req.body = JSON.parse(req.body);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Request body must be valid JSON or form data",
                });
            }
        }

        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            req.body = {};
        }
    }
    next();
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON in request body",
        });
    }

    next(err);
});

app.use("/", routes)

module.exports = app;