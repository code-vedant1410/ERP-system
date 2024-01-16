const express = require("express");
const app = express();
const userRoutes = require("../routes/userRoutes");
const { errorHandler } = require("../middlewares/errorMiddleware");
const stockRoutes = require("../routes/stockRoutes");
const authRoutes = require("../routes/authRoutes");
const authMiddleware = require("../middlewares/authMiddleware");
const productRoutes = require("../routes/productRoutes");
const salesRoutes = require("../routes/salesRoutes");
const User = require("../routes/passRoutes");

app.use(errorHandler);
app.use(express.json());
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/stock", stockRoutes);
app.use("/products", productRoutes);
app.use("/sales", salesRoutes);
app.use("/pass", User);

app.set("views", __dirname);
app.set("view engine", "ejs");

app.get("/api/data", authMiddleware.verifyToken, (req, res) => {
  res.json({ message: "Protected data accessed!" });
});

//This is dashboard module
app.get("/", (req, res) => {
  console.log("jahdshihaFKJ");
  const dashboardData = {
    sales: 50000,
    orders: 120,
    inventory: 3000,
  };
  res.render("dashboard", { data: dashboardData });
});

module.exports = app;
