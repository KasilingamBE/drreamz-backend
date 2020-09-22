const DB = require("../../utils/DB");
const Form = require("./utils/formModel");
DB();

exports.handler = async (event) => {
  try {
    switch (event.type) {
      case "getOneForm":
        return await Form.findById(event.arguments.id);
      case "getOneFormBySlug":
        return await Form.findOne({
          $or: [
            { slug: event.arguments.slug, published: true },
            { slug: event.arguments.slug, userId: event.arguments.userId },
          ],
        });
      case "getAllForms":
        return await Form.find();
      case "createOneForm":
        return await Form.create(event.arguments);
      case "updateOneForm":
        return await Form.findByIdAndUpdate(
          event.arguments.id,
          event.arguments,
          {
            new: true,
            runValidators: true,
          }
        );
      case "deleteOneForm":
        return await Form.findByIdAndDelete(event.arguments.id);
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
