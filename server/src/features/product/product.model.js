const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    slug: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    unit: {
      type: String,
      enum: [
        "kg",
        "g",
        "ton",
        "litre",
        "ml",
        "bag",
        "packet",
        "piece",
        "dozen",
      ],
      required: true,
    },

    brand: {
      type: String,
      default: "",
    },

    tags: [String],

    images: [
      {
        url: String,
        alt: String,
      },
    ],

    status: {
      type: String,
      enum: ["Active", "Inactive", "Out of Stock"],
      default: "Active",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    totalSold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);