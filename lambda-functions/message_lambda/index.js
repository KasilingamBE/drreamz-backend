const DB = require("../../utils/DB");
const Message = require("./utils/messageModel");
DB();

exports.handler = async (event) => {
  try {
    switch (event.type) {
      case "getMessages":
        return await Message.find();
      case "createMessage":
        return await Message.create(event.arguments);
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
