const DB = require("../../utils/DB");
const Message = require("./utils/messageModel");
DB();

exports.handler = async (event) => {
  try {
    switch (event.type) {
      // case "getMessages":
      //   return await Message.find();
      case "getDistinctListingsFromMessages":
        return await Message.distinct("listingId");
      case "getDriverOwnerMessagesByListingId":
        return await Message.find({ $and:[{ listingId:event.arguments.listingId},{driverId:event.arguments.driverId},{ownerId:event.arguments.ownerId}]});
      case "getDriverMessages":
        return await Message.find({driverId:event.arguments.driverId}); 
      case "getListingMessages":
        return await Message.find({listingId:event.arguments.listingId});   
      case "createMessage":
        return await Message.create(event.arguments);
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
