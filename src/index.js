import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { CustomError, ResData } from "./utils/responseHelpers.js";
import { connectDB } from "./config/db.config.js";
import { router } from "./routes/router.js";
import cookieParser from "cookie-parser";
import User from "./schema/auth.schmea.js";
import { run_cron } from "./cron/index.js";
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
});
const d = async () => {
  const now = new Date().toISOString().slice(0, 10);
  const usersOnLeave = await User.find({
    active: false,
    status: "ta'tilda",
  });
  for (const user of usersOnLeave) {
    const last_leave = user.leave_history[user.leave_history.length - 1];
    const endDate = new Date(last_leave.end_date).toISOString().slice(0, 10);
    if ("2025-04-28" === endDate) {
      console.log("salom");
      console.log(last_leave);
    } else {
      console.log("hali vaqt bor");
      console.log(last_leave);
    }
  }
};
// d();
