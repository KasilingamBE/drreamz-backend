const DB = require('../../utils/DB');
const PromoCode = require('./utils/promoCodeModel');
DB();

exports.handler = async (event) => {
  try {
    switch (event.type) {
      case 'getPromoCode':
        return await PromoCode.findById(event.arguments.id);
      case 'getPromoCodesByListingId':
        return await PromoCode.find({ listingId: event.arguments.listingId }).exec();
      case 'createPromoCode':
        return await PromoCode.create(event.arguments);
      case 'updatePromoCode':
        return await PromoCode.findByIdAndUpdate(
          event.arguments.id,
          event.arguments,
          {
            new: true,
            runValidators: true,
          }
        );
      case 'deletePromoCode':
        return await PromoCode.findByIdAndDelete(event.arguments.id);
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
