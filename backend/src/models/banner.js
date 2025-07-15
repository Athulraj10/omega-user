const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      maxLength: 255,
    },
    titleLine1: {
      type: String,
      maxLength: 100,
      default: "",
    },
    titleLine2: {
      type: String,
      maxLength: 100,
      default: "",
    },
    offerText: {
      type: String,
      maxLength: 200,
      default: "",
    },
    offerHighlight: {
      type: String,
      maxLength: 50,
      default: "",
    },
    buttonText: {
      type: String,
      maxLength: 50,
      default: "Shop now",
    },
    device: {
      type: String,
      maxLength: 20,
      enum: ["desktop", "mobile"],
      default: "desktop",
    },
    status: {
      type: String,
      enum: ["1", "0"],
      default: "1", // 1 = active, 0 = inactive
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    createDate: "date",
    updatedDate: "date",
  },
  { timestamps: { createDate: "createdAt", updatedDate: "updated_at" } }
);

module.exports = mongoose.model("Banner", bannerSchema);
