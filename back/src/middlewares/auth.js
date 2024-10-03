const User = require("../api/models/users");
const { verifyToken } = require("../utils/token");

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }
    const parsedtoken = token.replace("Bearer ", "");
    const decodedtoken = verifyToken(parsedtoken);

    if (!decodedtoken.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decodedtoken.id);
    if (user.role === "admin" || "client") {
      user.password = undefined;
      req.user = user;
      next();
    }
  } catch (error) {
    return res.status(401).json("Unauthorized");
  }
};

module.exports = { isAuth };
