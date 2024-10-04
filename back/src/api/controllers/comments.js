const Comment = require("../models/comment");
const Restaurant = require("../models/restaurant");

const getComments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comments = await Comment.find({ restaurant: id }).populate(
      "user",
      "userName lastName"
    );
    if (comments.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this restaurant" });
    }
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(404).json("Comments not found");
  }
};

const createComments = async (req, res, next) => {
  try {
    const { restaurant } = req.body;
    const { text, rating } = req.body;
    const user = req.user._id;

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }
    if (!text || !rating || typeof rating !== "number") {
      return res.status(400).json({ message: "Invalid input data" });
    }
    const restaurantDoc = await Restaurant.findById(restaurant);
    if (!restaurantDoc) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const newComment = new Comment({
      user,
      restaurant,
      text,
      rating,
    });
    const commentSaved = await newComment.save();

    restaurantDoc.comments.push(commentSaved._id);
    restaurantDoc.rating_number += 1;
    if (restaurantDoc.rating_number > 0) {
      restaurantDoc.average_rating =
        (restaurantDoc.average_rating * (restaurantDoc.rating_number - 1) +
          rating) /
        restaurantDoc.rating_number;
    } else {
      restaurantDoc.average_rating = rating;
    }
    await restaurantDoc.save();
    return res.status(201).json({ message: "Comment created", commentSaved });
  } catch (error) {
    console.error("Error al crear el comentario:", error);
    return res.status(500).json({ message: "Failed to create comment", error });
  }
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
