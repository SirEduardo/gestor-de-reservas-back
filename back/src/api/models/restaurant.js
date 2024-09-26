const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: "users", required: true },
    category: {
      type: String,
      enum: [
        "Grill",
        "Italiana",
        "Japonesa",
        "Cafeteria",
        "Gourmet",
        "Tradicional",
        "Bistro",
        "tapas",
      ],
      required: true,
    },
    img: { type: String },
    menu: { type: Schema.Types.ObjectId, ref: "menus" },
    telephone: { type: String, required: true, trim: true },
    schedule: {
      opnening: { type: String, required: true },
      closing: { type: String, required: true },
    },
    creation_date: { type: Date, default: Date.now },
    average_rating: { type: Number, default: 0, min: 0, max: 5 },
    raing_number: { type: Number, default: 0 },
  },
  {
    collection: "restaurants",
  }
);

const Restaurant = mongoose.model(
  "restaurants",
  restaurantSchema,
  "restaurants"
);
module.exports = Restaurant;
