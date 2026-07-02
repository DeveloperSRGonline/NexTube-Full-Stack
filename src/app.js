import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// app is express instance
const app = express();


/* middlewares */
// cors configuration
app.use(cors({origin: process.env.CORS_ORIGIN,credentials: true}));

// middleware for parsing json data with limit of 16kb
app.use(express.json({limit: "16kb"}));

// middleware for parsing url encoded data
app.use(express.urlencoded({extended: true,limit: "16kb"}));

// middleware for serving static files
app.use(express.static("public"));

// to perform crud operation on cookies
app.use(cookieParser())


/* routes */
import userRouter from "./routes/user.routes.js"

// routes declaration
// we not writing routes logic here its in routes folder so we need to use middleware to connect routes folder to app
app.use("/api/v1/users",userRouter)

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    
    return res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong",
        errors: err.errors || [],
        statusCode: statusCode
    });
});

export { app };
