const DB = require('../../utils/DB');
const Booking = require('./utils/bookingModel');
DB();

exports.handler = async (event) => {
  try {
    switch (event.type) {
      case 'getBooking':
        return await Booking.findById(event.arguments.id);
      //   case "getOneRoomBySlug":
      //     return await Listing.findOne({
      //       $or: [
      //         { slug: event.arguments.slug, published: true },
      //         { slug: event.arguments.slug, userId: event.arguments.userId },
      //       ],
      //     });
      case 'getBookingsWithListingId':
        return await Booking.find({
          listingId: event.arguments.listingId,
        }).exec();
      case 'getUserBookings':
        return await Booking.find({ userId: event.arguments.userId }).exec();
      case 'createBooking':
        return await Booking.create(event.arguments);
      case 'updateBooking':
        return await Booking.findByIdAndUpdate(
          event.arguments.id,
          event.arguments,
          {
            new: true,
            runValidators: true,
          }
        );
      case 'deleteBooking':
        return await Booking.findByIdAndDelete(event.arguments.id);
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
