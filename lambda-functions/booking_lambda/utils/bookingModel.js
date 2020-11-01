const mongoose = require("mongoose");

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

// const vt = {
//   images: [
//     "https://parkyourselfbucket154227-dev.s3.us-east-1.amazonaws.com/public/images/9e455f68-0e4f-4710-9aee-d3482b056d14parking.jpg",
//   ],
//   userId: "e4ed0beb-0f8a-4c8a-b6fe-e5ed9a603ddf",
//   username: "John Doe",
//   listingId: "id",
//   address:
//     "51, Mahatma Gandhi Road, Kala Ghoda, Fort, Mumbai, Maharashtra 400001, India",
//   start: "00:20",
//   end: "21:20",
//   payment: 100,
//   vehicle: "Car",
//   profileCategory: "Business",
//   status: "upcoming",
// };

// {
//   driverId,
//     driverName,
//     listingId,
//     ownerId,
//     startTime,
//     startDate,
//     endTime,
//     endDate,
//     status,
//     profileCategory,
//     vehicle,
//     address,
//     images,
//     payment,
//     paymentMethod;
// }

// const bookingSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//     required: true,
//   },
//   username: {
//     type: String,
//     required: true,
//   },
//   listingId: {
//     type: mongoose.Schema.ObjectId,
//     ref: "listings",
//   },
//   address: {
//     type: String,
//     required: true,
//   },
//   images: [String],
//   startDate: {
//     type: String,
//     required: true,
//   },
//   startTime: {
//     type: String,
//     required: true,
//   },
//   endDate: {
//     type: String,
//     required: true,
//   },
//   endTime: {
//     type: String,
//     required: true,
//   },
//   payment: {
//     type: Number,
//     required: true,
//   },
//   cardDetails: {
//     type: cardDetailsSchema,
//     required: true,
//   },
//   vehicle: {
//     type: vehicleSchema,
//     required: true,
//   },
//   vehicle: String,
//   profileCategory: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     required: true,
//   },
// });

const bookingSchema = new mongoose.Schema({
  driverId: String,
  driverName: String,
  driverEmail: String,
  listingId: String,
  ownerId: String,
  ownerName:String,
  ownerEmail:String,
  address: String,
  images: [String],
  start: String,
  end: String,
  status: String,
  profileCategory: String,
  vehicle: String,
  payment: String,
  paymentMethod: String,
  qrCode:String,
  spaceLabel:String,
  createdAt: {
    type:String,
    default:new Date().toString()
  }
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
