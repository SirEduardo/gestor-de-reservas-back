const { uploadRestaurants } = require("../../middlewares/file");
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  deleteRestaurant,
  getRestaurantByName,
  updateRestaurant,
} = require("../controllers/restaurant");

const restaurantRoutes = require("express").Router();

restaurantRoutes.get("/", getRestaurants);
restaurantRoutes.get("/:id", getRestaurantById);
restaurantRoutes.get("/search", getRestaurantByName);
restaurantRoutes.post("/", uploadRestaurants.single("img"), createRestaurant);
restaurantRoutes.delete("/:id", deleteRestaurant);
restaurantRoutes.put("/:id", updateRestaurant);

module.exports = restaurantRoutes;
