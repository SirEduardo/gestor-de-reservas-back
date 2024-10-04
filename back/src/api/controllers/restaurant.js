const { deleteFiles } = require("../../utils/deleteFiles");
const Restaurant = require("../models/restaurant");
const User = require("../models/users");

const getRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find();
    return res.status(200).json(restaurants);
  } catch (error) {
    return res.status(404).json("No restaurants found");
  }
};
const getRestaurantById = async (req, res, next) => {
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

    if (!name || name.trim() === "") {
      const allRestaurants = await Restaurant.find({});
      return res.status(200).json(allRestaurants);
    }

    const restaurants = await Restaurant.find({
      name: { $regex: name, $options: "i" },
    });

    if (restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron restaurantes." });
    }

    return res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error intentando encontrar restaurantes:", error);
    return res.status(500).json("Error intentando encontrar restaurantes");
  }
};

const createRestaurant = async (req, res, next) => {
  try {
    const { name, location, user, category, telephone, opening, closing } =
      req.body;

    if (
      !name ||
      !location ||
      !user ||
      !category ||
      !telephone ||
      !opening ||
      !closing
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    const img = req.file.path;
    const userInfo = await User.findById(user);
    if (!userInfo) {
      return res.status(404).json("Owner not found");
    }
    const newRestaurant = new Restaurant({
      name,
      location,
      user,
      category,
      img,
      telephone,
      opening,
      closing,
    });
    const restaurantSaved = await newRestaurant.save();
    userInfo.restaurant.push(restaurantSaved._id);
    await userInfo.save();

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
    const {
      name,
      location,
      owner,
      category,
      img,
      telephone,
      opening,
      closing,
    } = req.body;
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { name, location, owner, category, img, telephone, opening, closing },
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
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  deleteRestaurant,
  getRestaurantByName,
  updateRestaurant,
};
