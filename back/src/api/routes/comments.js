const { isAuth } = require("../../middlewares/auth");
const {
  getComments,
  createComments,
  deleteComments,
} = require("../controllers/comments");

const commentsRoutes = require("express").Router();

commentsRoutes.get("/:id", getComments);
commentsRoutes.post("/:id", [isAuth], createComments);
commentsRoutes.delete("/:id", [isAuth], deleteComments);

module.exports = commentsRoutes;
