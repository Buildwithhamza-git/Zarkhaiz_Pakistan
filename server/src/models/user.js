const mongoose = require("mongoose")

const SignupSchema = new mongoose.Schema({
    firstname: {
        type:String,
        required: true,
        trim:true
    },
    lastname:{
        type:String,
        trim: true,
        required: true
    },
    username: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      required: true,
      default: "",
    },

    city: {
      type: String,
      required: true,
      default: "",
    },

    province: {
      type: String,
      required: true,
      default: "",
    },

    country: {
      type: String,
      required: true,
      default: "Pakistan",
    },

    postalCode: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      required: true,
      enum: ["farmer", "seller", "admin"],
      default: "farmer",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("User", SignupSchema);