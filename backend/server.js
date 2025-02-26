import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";

import userRouter from "./routes/userRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js"

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors({ origin: process.env.APP_URL, credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", userRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
