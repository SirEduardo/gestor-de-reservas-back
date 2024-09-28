const Comment = require("../models/comment");

const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find();
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(404).json("Comments not found");
  }
};

const createComments = async (req, res, next) => {
  try {
    const { restaurant, text } = req.body;
    const user = req.user.id;
    const newComment = new Comment({
      user,
      restaurant,
      text,
    });
    const commentSaved = await newComment.save();
    return res
      .status(201)
      .json({ message: "Comment created", commentSaved: commentSaved });
  } catch (error) {}
};

const deleteComments = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const user = req.params.id;

    const comment = await Comment.findOne({ _id, commentId, user });
    if (!comment) {
      return res.status(404).json({
        message: "Commnet not found or you do not have permission to delete it",
      });
    }
    const commentDeleted = await comment.findByIdAndDelete(commentId);
    return res.status(200).json(commentDeleted);
  } catch (error) {}
};

module.exports = { getComments, createComments, deleteComments };
