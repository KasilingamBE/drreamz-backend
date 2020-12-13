const DB = require("../../utils/DB");
const Fee = require("./utils/feeModel");
DB();

exports.handler = async (event) => {
  try {
    switch (event.type) {
      case "getOneFee":
        return await Fee.findById(process.env.FEE_ID);
      case "createOneFee":
        return await Fee.create({
          ...event.arguments,
          decimal: event.arguments.fee / 100,
        });
      case "updateOneFee":
        return await Fee.findByIdAndUpdate(
          process.env.FEE_ID,
          {
            ...event.arguments,
            decimal: event.arguments.fee / 100,
            updatedAt: new Date(),
          },
          {
            new: true,
            runValidators: true,
          }
        );
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
