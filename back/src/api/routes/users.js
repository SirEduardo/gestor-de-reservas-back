const { getUsers, registerUser, loginUser } = require("../controllers/users");

const userRoutes = require("express").Router();

userRoutes.get("/", getUsers);
userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);

module.exports = userRoutes;
