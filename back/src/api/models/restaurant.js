const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: "user" },
    category: { type: String, required: true },
    img: { type: String },
    menu: { type: Schema.Types.ObjectId, ref: "menu" },
    telephone: { type: String, required: true, trim: true },
    opening: { type: String, required: true },
    closing: { type: String, required: true },
    creation_date: { type: Date, default: Date.now },
    average_rating: { type: Number, min: 0, max: 5, default: 0 },
    rating_number: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
    reservations: [
      { type: mongoose.Schema.Types.ObjectId, ref: "reservation" },
    ],
  },
  {
    collection: "restaurants",
  }
);

const Restaurant = mongoose.model(
  "restaurant",
  restaurantSchema,
  "restaurants"
);
module.exports = Restaurant;
