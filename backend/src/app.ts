import express from "express";
import healthRouter from "./routes/health.routes.js"
import { errorHandler } from "./middleware/error.middleware.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use("/api/v1", healthRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1/auth", authRouter);

app.use(errorHandler)


export default app;