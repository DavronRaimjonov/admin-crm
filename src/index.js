import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { CustomError, ResData } from "./utils/responseHelpers.js";
import { connectDB } from "./config/db.config.js";
import { router } from "./routes/router.js";
import cookieParser from "cookie-parser";
import { run_cron } from "./cron/index.js";
import { swaggerDocs } from "./utils/swagger.js";
const app = express();
dotenv.config();

let PORT = process.env.PORT || 7070;

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api", router);

app.use((req, res, next) => {
  try {
    throw new CustomError(404, `This ${req.url} page not found`);
  } catch (error) {
    next(error);
  }
});
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  const resData = new ResData(statusCode, error.message);
  return res.status(resData.status).json(resData);
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
  run_cron();
  connectDB();
  swaggerDocs(app, PORT);
});

// d();
