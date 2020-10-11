const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  licensePlate: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  image: {
    type: String,
  },
});

const cardDetailsSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  expiry: {
    type: String,
    required: true,
  },
  nameOnCard: {
    type: String,
    required: true,
  },
  setDefault: {
    type: Boolean,
    required: true,
  },
});

const bookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  listingId: {
    type: mongoose.Schema.ObjectId,
    ref: 'listings',
  },
  address: {
    type: String,
    required: true,
  },
  images: [String],
  startDate: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  payment: {
    type: Number,
    required: true,
  },
  cardDetails: {
    type: cardDetailsSchema,
    required: true,
  },
  vehicle: {
    type: vehicleSchema,
    required: true,
  },
  profileCategory: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
