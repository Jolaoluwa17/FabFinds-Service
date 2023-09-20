const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      User: {
        type: Number,
        default: 2003,
      },
      Admin: Number,
    },
    accessToken: {
      type: String,
      required: false,
    },
    otp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Otp",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
