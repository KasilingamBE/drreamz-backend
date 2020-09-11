const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    unique: true,
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

roomSchema.index({ slug: 1 });

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
