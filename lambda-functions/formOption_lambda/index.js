const DB = require("../../utils/DB");
const FormOption = require("./utils/formOptionModel");
DB();

exports.handler = async (event) => {
  try {
    switch (event.type) {
      case "getOneFormOption":
        return await FormOption.findById(event.arguments.id);
      case "getAllFormOptions":
        return await FormOption.find(
          event.arguments.filter ? JSON.parse(event.arguments.filter) : {}
        );
      case "createOneFormOption":
        return await FormOption.create(event.arguments);
      case "updateOneFormOption":
        return await FormOption.findByIdAndUpdate(
          event.arguments.id,
          { ...event.arguments, updatedAt: new Date() },
          {
            new: true,
            runValidators: true,
          }
        );
      case "deleteOneFormOption":
        return await FormOption.findByIdAndDelete(event.arguments.id);
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
