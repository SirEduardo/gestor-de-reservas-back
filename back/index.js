require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const userRoutes = require("./src/api/routes/users");
const restaurantRoutes = require("./src/api/routes/restaurant");
const reservationRoutes = require("./src/api/routes/reservations");

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.use(cors());
app.options("*", cors());
app.use(express.json());

connectDB();

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/restaurants", restaurantRoutes);
app.use("/api/v1/reservations", reservationRoutes);

app.use("*", (req, res) => {
  return res.status(404).json("Route not found");
});

app.listen(3000, () => {
  console.log("Running in http://localhost:3000");
});
