const { generateToken } = require("../../utils/token");
const User = require("../models/users");
const bcrypt = require("bcrypt");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json("Error when collecting users");
  }
};

const registerUser = async (req, res, next) => {
  try {
    const newUser = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    });
    const userExist = await User.findOne({ email: req.body.email });
    if (!userExist) {
      return res.status(409).json("This user already exists");
    }
    const userSaved = await newUser.save();
    return res.status(200).json(userSaved);
  } catch (error) {
    return res.status(400).json("Error when registering the user");
  }
};

const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("User not found");
    }
    if (bcrypt.compare(req.body.password, user.password)) {
      const token = generateToken(user._id);
      return res.status(200).json({ user, token });
    }
    return res.status(400).json("Incorrect username or password");
  } catch (error) {
    return res.status(400).json("Error when login");
  }
};

module.exports = { getUsers, registerUser, loginUser };
