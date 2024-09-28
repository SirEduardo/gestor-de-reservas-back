const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commmentSchema = new Schema(
  {
    user: { trype: Schema.Types.ObjectId, ref: "users", required: true },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "restaurants",
      required: true,
    },
    text: { type: String, required: true, trim: true },
    rating: { type: Number, rqeuired: true, min: 0, max: 5 },
    craetion_date: { type: Date, default: Date.now },
  },
  {
    collection: "comment",
  }
);

const Comment = mongoose.model("comments", commmentSchema, "comments");
module.exports = Comment;
