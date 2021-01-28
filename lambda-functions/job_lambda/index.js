const DB = require("../../utils/DB");
const JobUser = require("./utils/jobUserModel");
DB();

exports.handler = async (event) => {
  try {
    switch (event.type) {
      case "getOneJobUser":
        return await JobUser.findById(event.arguments.id);
      case "getOneJobUserBySlug":
        return await JobUser.findOne({
          $or: [
            { slug: event.arguments.slug }
            
          ],
        });
      case "getAllJobUser":
        return await JobUser.find();
      case "createOneJobUser":
        return await JobUser.create(event.arguments);
      
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};