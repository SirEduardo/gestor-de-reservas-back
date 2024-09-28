const {
  getComments,
  createComments,
  deleteComments,
} = require("../controllers/comments");

const commentsRoutes = require("express").Router();

commentsRoutes.get("/", getComments);
commentsRoutes.post("/", createComments);
commentsRoutes.delete("/:id", deleteComments);

module.exports = commentsRoutes;
