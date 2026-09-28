import express from "express";
import healthRouter from "./routes/health.routes.js"
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());
app.use("/api/v1", healthRouter)

app.use(errorHandler)


export default app;