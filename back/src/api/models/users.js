const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: false,
      enum: ["admin", "client"],
      default: "client",
    },
    restaurant: [{ type: mongoose.Schema.Types.ObjectId, ref: "restaurant" }],
    reservations: [
      { type: mongoose.Schema.Types.ObjectId, ref: "reservation" },
    ],
    creation_date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const User = mongoose.model("user", userSchema, "users");
module.exports = User;
