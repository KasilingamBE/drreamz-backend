const DB = require("../../utils/DB");
const Image = require("../../models/imageModel");
DB();

exports.handler = async (event) => {
  try {
    switch (event.type) {
      case "getAllImages":
        return await Image.find();
      case "uploadImage":
        return await Image.create(event.arguments);
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
