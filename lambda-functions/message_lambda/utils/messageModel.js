const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  // messageId: String,
  body: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  handle: String,
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
