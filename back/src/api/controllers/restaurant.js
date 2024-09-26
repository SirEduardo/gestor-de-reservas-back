const Restaurant = require("../models/restaurant");
const User = require("../models/users");

const getRestuarants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find();
    return res.status(200).json(restaurants);
  } catch (error) {
    return res.status(404).json("No restaurants found");
  }
};
const getRestuarantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json("Restaurant not found");
    }
    return res.status(200).json(restaurant);
  } catch (error) {
    return res.status(400).json("Error while picking up restaurants ");
  }
};

const createRestaurant = async (req, res, next) => {
  try {
    const { name, location, owner, category, img, telephone, schedule } =
      req.body;
    if (
      !name ||
      location ||
      owner ||
      category ||
      img ||
      telephone ||
      schedule
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findById(owner);
    if (!user) {
      return res.status(400).json("owner not found");
    }
    if (user.role !== "admin") {
      return res
        .status(403)
        .json("Only users with admin role can create restaurants");
    }
    const newRestaurant = new Restaurant({
      name,
      location,
      owner,
      category,
      img,
      telephone,
      schedule,
    });
    const restaurantSaved = await newRestaurant.save();
    return res
      .status(200)
      .json({ message: "Successfully created restaurant", restaurantSaved });
  } catch (error) {
    return res.status(400).json("Error creating restaurant");
  }
};

const deleteRestaurant = async (req, res, next) => {
  try {
    if (!req.user || req.user.id) {
      return res.status(400).json("User not verified");
    }
    const { id } = req.params;
    const userId = req.user.id;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(400).json("Restaurant not found");
    }
    if (restaurant.owner !== userId) {
      return res
        .status(400)
        .json("User not authorized to delet this restaurant");
    }
    const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "Restaurant deleted", deleteRestaurant });
  } catch (error) {}
};

module.exports = {
  getRestuarants,
  getRestuarantById,
  createRestaurant,
  deleteRestaurant,
};
