const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: "user", required: true },
    category: {
      type: String,
      enum: [
        "grill",
        "italiana",
        "japonesa",
        "cafeteria",
        "gourmet",
        "tradicional",
        "bistro",
        "tapas",
      ],
      required: true,
    },
    img: { type: String },
    menu: { type: Schema.Types.ObjectId, ref: "menu" },
    telephone: { type: String, required: true, trim: true },
    schedule: {
      opening: { type: String, required: true },
      closing: { type: String, required: true },
    },
    creation_date: { type: Date, default: Date.now },
    average_rating: { type: Number, min: 0, max: 5, default: 0 },
    rating_number: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
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
