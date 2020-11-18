const mongoose = require("mongoose");
require("mongoose-long")(mongoose);
const Long = mongoose.Schema.Types.Long;

const bookingSchema = new mongoose.Schema({
  driverId: String,
  driverName: String,
  driverEmail: String,
  // listingId: String,
  listingId: {
    type: mongoose.Schema.ObjectId,
    ref: "Listing",
  },
  ownerId: String,
  ownerName: String,
  ownerEmail: String,
  address: String,
  images: [String],
  start: String,
  startDate: Long,
  end: String,
  endDate: Long,
  status: String,
  profileCategory: String,
  vehicle: String,
  payment: String,
  paymentMethod: String,
  paymentIntent: String,
  transferGroup: String,
  qrCode: String,
  spaceLabel: String,
  createdBy: String,
  createdAt: {
    type: String,
    default: new Date().toString(),
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
