const DB = require("../../utils/DB");
const Booking = require("./utils/bookingModel");
const { setupTransfer } = require("./utils/cloudWatchEvent");
const { mailer } = require("../../utils/mailer");
const StripePayment = require("../payment_lambda/utils/stripePayment");
const ObjectId = require("mongodb").ObjectID;
DB();

exports.handler = async (event) => {
  try {
    let updatedBooking = null;
    switch (event.type) {
      case "getBooking":
        return await Booking.findById(ObjectId(event.arguments.id));
      case "getBookingsWithListingId":
        return await Booking.find({
          listingId: ObjectId(event.arguments.listingId),
        }).exec();
      case "getBookingsWithOwnerId":
        return await Booking.find({
          ownerId: ObjectId(event.arguments.ownerId),
        }).exec();
      case "getBookingsWithListingIdAndStatus":
        return await Booking.find({
          listingId: ObjectId(event.arguments.listingId),
          status: event.arguments.status,
        }).exec();
      case "getDriverBookings":
        return await Booking.find({
          driverId: event.arguments.driverId,
        }).exec();
      case "getOwnerBookings":
        return await Booking.find({
          ownerId: event.arguments.ownerId,
        }).exec();
      case "checkBookingAvailability":
        const tempSlots = await Booking.find({
          listingId: ObjectId(event.arguments.listingId),
          $or: [
            {
              $and: [
                { startDate: { $lte: Date.parse(event.arguments.start) } },
                { endDate: { $gt: Date.parse(event.arguments.start) } },
              ],
            },
            {
              $and: [
                { startDate: { $lt: Date.parse(event.arguments.end) } },
                { endDate: { $gte: Date.parse(event.arguments.end) } },
              ],
            },
          ],
        });
        return tempSlots.map((s) => s.spaceLabel);
      case "setupPayout":
        return await setupTransfer({
          bookingId: event.arguments.listingId,
          end: event.arguments.triggerTimer,
        });
      case "createBooking":
        const newBooking = await Booking.create({
          ...event.arguments,
          listingId: ObjectId(event.arguments.listingId),
          startDate: Date.parse(event.arguments.start),
          endDate: Date.parse(event.arguments.end),
        });
        // Send Email to driver and space owner
        const tempOwnerData = {
          emails: [event.arguments.ownerEmail],
          subject: "You have a new Booking",
          message: "A User just booked a space at your Parking!",
        };
        const tempDriverData = {
          emails: [event.arguments.driverEmail],
          subject: "Booking Successful",
          message: "Congratulations!Your Booking is Successful",
        };
        await mailer(tempOwnerData);
        await mailer(tempDriverData);
        await setupTransfer({
          bookingId: newBooking._id,
          end: newBooking.end,
        });
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
        if (event.arguments.status === "cancelled") {
          const tempBooking = await Booking.findById(
            ObjectId(event.arguments.id)
          );
          const tempRefund = await StripePayment.createRefund({
            paymentIntent: tempBooking.paymentIntent,
          });
          if (tempRefund === "succeeded") {
            updatedBooking = await Booking.findByIdAndUpdate(
              ObjectId(event.arguments.id),
              { status: event.arguments.status },
              {
                new: true,
                runValidators: true,
              }
            );
          } else {
            return null;
          }
        } else {
          updatedBooking = await Booking.findByIdAndUpdate(
            ObjectId(event.arguments.id),
            { status: event.arguments.status },
            {
              new: true,
              runValidators: true,
            }
          );
        }
        //Send Email to driver and space owner
        if (event.arguments.status === "current") {
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
        } else if (event.arguments.status === "completed") {
          const tempOwnerData = {
            emails: [event.arguments.ownerEmail],
            subject: "A User just Checked Out",
            message: "A User has been checked out successfully!",
          };
          const tempDriverData = {
            emails: [event.arguments.driverEmail],
            subject: "You have Checked Out",
            message: "You have Checked Out Successfully!",
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
