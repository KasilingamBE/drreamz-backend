const DB = require('../../utils/DB');
const Listing = require('./utils/listingModel');
const cognito = require('../common_lambda/utils/Cognito');
const User = require('../user_lambda/utils/userModel');
DB();

exports.handler = async (event) => {
  try {
    let tempFilter = {};
    switch (event.type) {
      case 'getListing':
        return await Listing.findById(event.arguments.id);
      case 'getAllListingsSearch':
        const {
          page = 1,
          limit = 10,
          search = '',
          username = null,
          active = null,
        } = event.arguments;

        if (username !== null) {
          tempFilter.ownerId = username;
        }
        if (active !== null) {
          tempFilter.published = active;
        }

        const listings = await Listing.find({
          ...tempFilter,
          $or: [
            {
              'locationDetails.address': { $regex: search, $options: 'i' },
            },
            {
              ownerName: { $regex: search, $options: 'i' },
            },
            {
              ownerEmail: { $regex: search, $options: 'i' },
            },
          ],
        })
          .limit(limit * 1)
          .skip((page - 1) * limit);

        const listingsCount = await Listing.countDocuments({
          ...tempFilter,
          $or: [
            {
              'locationDetails.address': { $regex: search, $options: 'i' },
            },
            {
              ownerName: { $regex: search, $options: 'i' },
            },
            {
              ownerEmail: { $regex: search, $options: 'i' },
            },
          ],
        });
        return {
          listings: listings,
          count: listingsCount,
        };
      case 'getPublishedListings':
        return await Listing.find({ published: true }).exec();
      case 'getListingsWithBookings':
        return await Listing.aggregate([
          {
            $geoNear: {
              near: {
                type: 'Point',
                coordinates: [event.arguments.lng, event.arguments.lat],
              },
              maxDistance: 100000,
              spherical: true,
              distanceField: 'distance',
            },
          },
          { $match: { published: true } },
          {
            $lookup: {
              from: 'bookings',
              as: 'bookingCount',
              let: {
                listingId: '$_id',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $or: [
                        {
                          $and: [
                            { $eq: ['$listingId', '$$listingId'] },
                            {
                              $lte: [
                                '$startDate',
                                Date.parse(event.arguments.start),
                              ],
                            },
                            {
                              $gt: [
                                '$endDate',
                                Date.parse(event.arguments.start),
                              ],
                            },
                          ],
                        },
                        {
                          $and: [
                            { $eq: ['$listingId', '$$listingId'] },
                            {
                              $lt: [
                                '$startDate',
                                Date.parse(event.arguments.end),
                              ],
                            },
                            {
                              $gte: [
                                '$endDate',
                                Date.parse(event.arguments.end),
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
                {
                  $count: 'total',
                },
              ],
            },
          },
        ]);
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
        User.findOneAndUpdate(
          { username: event.arguments.ownerId },
          { $inc: { listings: 1 } }
        );
        await cognito.createGroup({ groupName: `${listing._id}` });
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
        let deletedListing = await Listing.findByIdAndDelete(
          event.arguments.id
        );
        User.findOneAndUpdate(
          { username: event.arguments.ownerId },
          { $inc: { listings: -1 } }
        );
        await cognito.deleteGroup({ groupName: `${event.arguments.id}` });
        return deletedListing;
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
