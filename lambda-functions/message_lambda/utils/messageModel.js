const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  body: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  handle: String,
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
