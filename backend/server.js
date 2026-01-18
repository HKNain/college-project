import express from "express";
import dotenv from "dotenv";
import connectToDatabase from "./db/dbConnection.js";
import authRoute from "./routes/auth.routes.js"
import tableRoute from "./routes/table.route.js"
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT || 5001;


const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/api/auth",authRoute)
app.use("/api/table",tableRoute)




app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    connectToDatabase();
});