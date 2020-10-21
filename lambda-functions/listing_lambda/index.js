const DB = require('../../utils/DB');
const Listing = require('./utils/listingModel');
DB();

exports.handler = async (event) => {
  try {
    switch (event.type) {
      case 'getListing':
        return await Listing.findById(event.arguments.id);
      //   case "getOneRoomBySlug":
      //     return await Listing.findOne({
      //       $or: [
      //         { slug: event.arguments.slug, published: true },
      //         { slug: event.arguments.slug, userId: event.arguments.userId },
      //       ],
      //     });
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
        return await Listing.create(event.arguments);
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
        return await Listing.findByIdAndDelete(event.arguments.id);
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
