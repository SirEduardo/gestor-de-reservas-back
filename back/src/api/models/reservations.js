const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "restaurants",
      required: true,
    },
    booking_date: { type: Date, required: true },
    time: { type: String, required: true },
    n_persons: { type: Number, required: true },
    state: {
      type: String,
      enum: ["pending", "confirmed", "canceled"],
      default: "pending",
    },
    creation_date: { type: Date, default: Date.now },
  },
  {
    collection: "reservations",
  }
);

const Reservation = mongoose.model(
  "reservations",
  reservationSchema,
  "reservations"
);
module.exports = Reservation;
