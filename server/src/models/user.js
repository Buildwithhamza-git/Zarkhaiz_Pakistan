const mongoose = require("mongoose")

const SignupSchema = new mongoose.Schema({
     firstname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    province: {
      type: String,
      trim: true,
      default: "",
    },


    postalCode: {
      type: String,
      trim: true,
      default: "",
    },

    role: {
      type: String,
      enum: ["farmer", "seller", "admin"],
      default: "farmer",
      index: true,
    },

    storeName: {
      type: String,
      trim: true,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      select: false,
    },

    otpExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)
const User = mongoose.model("User", SignupSchema);
module.exports = {User}