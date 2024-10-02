require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const userRoutes = require("./src/api/routes/users");
const restaurantRoutes = require("./src/api/routes/restaurant");
const reservationRoutes = require("./src/api/routes/reservations");
const commentsRoutes = require("./src/api/routes/comments");
const menusRoutes = require("./src/api/routes/menus");

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/restaurants", restaurantRoutes);
app.use("/api/v1/reservations", reservationRoutes);
app.use("/api/v1/comments", commentsRoutes);
app.use("/api/v1/menus", menusRoutes);

app.use("*", (req, res) => {
  return res.status(404).json("Route not found");
});

app.listen(3000, () => {
  console.log("Running in http://localhost:3000");
});
