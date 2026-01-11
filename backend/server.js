import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import { connectDB } from "./lib/db.js";
import path from "path";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import AnalyticsRoutes from "./routes/analytics.route.js";
import aiRoutes from "./routes/ai.routes.js";

// Read the content of .env file
dotenv.config();

const app = express();

// Read PORT from .env files constant PORT
const PORT = process.env.PORT;

const __dirname = path.resolve();
// limit the size of the request to be 50mb to handle large files
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", AnalyticsRoutes);
app.use("/api/ai", aiRoutes);
app.get("/api/test", (req, res) => res.send("Proxy works!"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
  connectDB();
});
