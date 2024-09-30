const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: false,
      enum: ["admin", "client"],
      default: "client",
    },
    creation_date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

const User = mongoose.model("user", userSchema, "users");
module.exports = User;
