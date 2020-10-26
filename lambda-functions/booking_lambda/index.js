const DB = require("../../utils/DB");
const Booking = require("./utils/bookingModel");
const { mailer } = require("../../utils/mailer");
const ObjectId = require('mongodb').ObjectID;
DB();

exports.handler = async (event) => {
  try {
    switch (event.type) {
      case "getBooking":
        return await Booking.findById(ObjectId(event.arguments.id));
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
        const newBooking = await Booking.create(event.arguments);
        //Send Email to driver and space owner
        const tempOwnerData = {
          emails: [event.arguments.ownerEmail],
          subject: "You have a new Booking",
          message: "A User just booked a space at your Parking!",
        };
        const tempDriverData = {
          emails: [event.arguments.driverEmail],
          subject: "Booking Successful",
          message: "Congratulations!Your Booking is Successful",
        }
        await mailer(tempOwnerData);
        await mailer(tempDriverData);
        return newBooking;
      case "updateBooking":
        return await Booking.findByIdAndUpdate(
          event.arguments.id,
          event.arguments,
          {
            new: true,
            runValidators: true,
          }
        );

        case "updateBookingStatus":
          const updatedBooking =  await Booking.findByIdAndUpdate(
            ObjectId(event.arguments.id),
            event.arguments,
            {
              new: true,
              runValidators: true,
            }
          );
          //Send Email to driver and space owner
          if(event.arguments.status==='current'){
          const tempOwnerData = {
            emails: [event.arguments.ownerEmail],
            subject: "A User just Checked In",
            message: "A User has been checked in successfully!",
          };
          const tempDriverData = {
            emails: [event.arguments.driverEmail],
            subject: "You have Checked In",
            message: "You have Checked in Successfully!",
          };
          await mailer(tempOwnerData);
          await mailer(tempDriverData);
      }
        return updatedBooking;
      case "deleteBooking":
        return await Booking.findByIdAndDelete(event.arguments.id);
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
