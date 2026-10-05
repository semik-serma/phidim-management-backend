import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./src/config/db.js";
import bill_router from "./src/routes/bill.routes.js";
import auth_router from "./src/routes/auth.routes.js";
import cookieParser from "cookie-parser";
import note_router from "./src/routes/notes.routes.js";
import trans_route from "./src/routes/transaction.routes.js";

const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use("/bills", bill_router);
app.use("/auth", auth_router);
app.use('/note',note_router)
app.use('/transaction',trans_route)

app.listen(5000, () => {
  console.log("Server running on port 5000");
});