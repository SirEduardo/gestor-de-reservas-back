const Menu = require("../models/menu");

const getMenu = async (req, res, next) => {
  try {
    const { id } = req.body;
    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }
    return res.status(200).json(menu);
  } catch (error) {
    return res.status(404).json("Menu not found");
  }
};

const createMenu = async (req, res, next) => {
  try {
    const { restaurant, description, price } = req.body;
    const newMenu = new Menu({
      restaurant,
      description,
      price,
    });
    const menuSaved = await newMenu.save();
    return res
      .status(201)
      .json({ message: "Menu created successfuly", menuSaved: menuSaved });
  } catch (error) {
    return res.status(500).json({ message: "Menu creation failed", error });
  }
};

const updateMenu = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { restaurant, description, price } = req.body;
    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      { restaurant, description, price },
      { new: true }
    );
    if (!updateMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }
    return res
      .status(200)
      .json({ message: "Menu updated successfuly", updatedMenu: updatedMenu });
  } catch (error) {
    return res.sattus(500).json({ message: "Update failed", error });
  }
};

module.exports = { getMenu, createMenu, updateMenu };
