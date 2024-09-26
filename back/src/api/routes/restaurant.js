const {
  getRestuarants,
  getRestuarantById,
  createRestaurant,
  deleteRestaurant,
} = require("../controllers/Restaurant");

const restaurantRoutes = require("express").Router();

restaurantRoutes.get("/", getRestuarants);
restaurantRoutes.get("/:id", getRestuarantById);
restaurantRoutes.post("/", createRestaurant);
restaurantRoutes.delete("/:id", deleteRestaurant);

module.exports = restaurantRoutes;
