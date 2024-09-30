const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commmentSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant",
      required: true,
    },
    text: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    creation_date: { type: Date, default: Date.now },
  },
  {
    collection: "comments",
  }
);

const Comment = mongoose.model("comment", commmentSchema, "comments");
module.exports = Comment;
