const DB = require('../../utils/DB');
const Listing = require('./utils/listingModel');
const cognito = require("../common_lambda/utils/Cognito");
DB();

exports.handler = async (event) => {
  try {
    switch (event.type) {
      case 'getListing':
        return await Listing.findById(event.arguments.id);
      case 'getPublishedListings':
        return await Listing.find({ published: true }).exec();
      case 'getPublishedListingsWithLatLng':
        return await Listing.find({
          published: true,
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [event.arguments.lng, event.arguments.lat],
              },
              $maxDistance: 100000,
            },
          },
        }).exec();
      case 'getOwnerListings':
        return await Listing.find({ ownerId: event.arguments.ownerId }).exec();
      case 'createListing':
        let listing = await Listing.create(event.arguments);
        await cognito.createGroup({groupName:`${listing._id}`});
        return listing;
      case 'updateListing':
        return await Listing.findByIdAndUpdate(
          event.arguments.id,
          event.arguments,
          {
            new: true,
            runValidators: true,
          }
        );
      case 'deleteListing':
        let deletedListing = await Listing.findByIdAndDelete(event.arguments.id);
        await cognito.deleteGroup({groupName:`${event.arguments.id}`});
        return deletedListing;
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
