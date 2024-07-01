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
      lowercase: true,
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
    refreshToken: {
      type: String,
      required: false,
    },
    otp: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// otp is changed to null after 2 minutes to signify it has expired
userSchema.post("save", function (doc) {
  if (doc.otp) {
    setTimeout(async () => {
      try {
        await mongoose.model("User").findByIdAndUpdate(doc._id, { otp: null });
      } catch (error) {
        console.error("Error updating OTP expiration:", error);
      }
    }, 2 * 60 * 1000); // 2 minutes in milliseconds
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
