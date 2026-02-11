import express from "express";
import dotenv from "dotenv";
import connectToDatabase from "./db/dbConnection.js";
import authRoute from "./routes/auth.route.js";
import tableRoute from "./routes/table.route.js";
import teacherRoute from "./routes/teacher.routes.js";
import excelRoute from "./routes/excel.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

app.use(
  cors({
    origin: "https://college-project-1-79dm.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/table", tableRoute);
app.use("/api/teacher", teacherRoute);
app.use("/api/excel", excelRoute);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectToDatabase();
});
