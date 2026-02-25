const mongoose = require("mongoose");

const catwaySchema = new mongoose.Schema(
  {
    catwayNumber: { type: Number, required: true, unique: true, min: 1 },
    catwayType: { type: String, required: true, enum: ["long", "short"] },
    catwayState: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Catway", catwaySchema);