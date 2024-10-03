const { getUser, registerUser, loginUser } = require("../controllers/users");
const { isAuth } = require("../../middlewares/auth");

const userRoutes = require("express").Router();

userRoutes.get("/", [isAuth], getUser);
userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);

module.exports = userRoutes;
