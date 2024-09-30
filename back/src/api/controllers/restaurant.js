const { deleteFiles } = require("../../utils/deleteFiles");
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
    const restaurant = await Restaurant.findById(id).populate("comments");
    if (!restaurant) {
      return res.status(404).json("Restaurant not found");
    }
    return res.status(200).json(restaurant);
  } catch (error) {
    return res.status(400).json("Error while picking up restaurants ");
  }
};
const getRestaurantByName = async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name) {
      const allRestaurants = await Restaurant.find({});
      return res.status(200).json(allRestaurants);
    }
    const restaurants = await Restaurant.find({
      name: { $regex: name, $options: "i" },
    });
    return res.status(200).json(restaurants);
  } catch (error) {
    return res.status(500).json("Error trying to find restaurants");
  }
};

const createRestaurant = async (req, res, next) => {
  try {
    const { name, location, owner, category, img, telephone, schedule } =
      req.body;
    if (
      !name ||
      !location ||
      !owner ||
      !category ||
      !img ||
      !telephone ||
      !schedule
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!schedule.opening || !schedule.closing) {
      return res
        .status(400)
        .json({ message: "Schedule must include opening and closing times" });
    }
    const user = await User.findById(owner);
    if (!user) {
      return res.status(404).json("owner not found");
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
    return res.status(201).json({
      message: "Successfully created restaurant",
      restaurant: restaurantSaved,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error creating restaurant", error: error.message });
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
    deleteFiles(deletedRestaurant.img);
    return res.status(200).json({
      message: "Restaurant deleted",
      deletedRestaurant: deletedRestaurant,
    });
  } catch (error) {
    return res
      .sttus(500)
      .json({ message: "Failed trying to delete restaurant", error });
  }
};

const updateRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, location, owner, category, img, telephone, schedule } =
      req.body;
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { name, location, owner, category, img, telephone, schedule },
      { new: true }
    );
    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    return res.status(200).json({
      message: "Restaurant updated successfuly",
      updatedRestaurant: updatedRestaurant,
    });
  } catch (error) {
    return res.status(500).json({ message: "Update failed", error });
  }
};

module.exports = {
  getRestuarants,
  getRestuarantById,
  createRestaurant,
  deleteRestaurant,
  getRestaurantByName,
  updateRestaurant,
};
