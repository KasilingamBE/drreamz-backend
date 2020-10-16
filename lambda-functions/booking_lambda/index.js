const DB = require("../../utils/DB");
const Booking = require("./utils/bookingModel");
const { mailer } = require("../../utils/mailer");
DB();

exports.handler = async (event) => {
  try {
    switch (event.type) {
      case "getBooking":
        return await Booking.findById(event.arguments.id);
      //   case "getOneRoomBySlug":
      //     return await Listing.findOne({
      //       $or: [
      //         { slug: event.arguments.slug, published: true },
      //         { slug: event.arguments.slug, userId: event.arguments.userId },
      //       ],
      //     });
      case "getBookingsWithListingId":
        return await Booking.find({
          listingId: event.arguments.listingId,
        }).exec();
      case "getDriverBookings":
        return await Booking.find({
          driverId: event.arguments.driverId,
        }).exec();
      case "getOwnerBookings":
        return await Booking.find({
          ownerId: event.arguments.ownerId,
        }).exec();
      case "createBooking":
        const tempBooking = await Booking.create(event.arguments);
        // Send Email to driver and space owner
        const tempData = {
          emails: [event.arguments.driverEmail, event.arguments.ownerEmail],
          subject: "You have new Booking",
          message: "Your Booking has been confirmed!",
        };
        await mailer(tempData);
        return tempBooking;
      case "updateBooking":
        return await Booking.findByIdAndUpdate(
          event.arguments.id,
          event.arguments,
          {
            new: true,
            runValidators: true,
          }
        );
      case "deleteBooking":
        return await Booking.findByIdAndDelete(event.arguments.id);
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
