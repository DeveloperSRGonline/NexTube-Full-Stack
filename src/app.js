import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// app is express instance
const app = express();

// cors configuration
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

// middleware for parsing json data with limit of 16kb
app.use(
    express.json({
        limit: "16kb",
    })
);

// middleware for parsing url encoded data
app.use(
    express.urlencoded({
        extended: true,
        list,
    })
);

// middleware for serving static files
app.use(express.static("public"));

// to perform crud operation on cookies
app.use(cookieParser())

export { app };
