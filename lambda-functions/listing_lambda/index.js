const DB = require('../../utils/DB');
const Listing = require('./utils/listingModel');
// const UserPoolId = process.env.USER_POOL_ID;
const AWS = require("aws-sdk");
AWS.config.region = "us-east-1";
const UserPoolId = 'us-east-1_biMepTpwK';

AWS.config.apiVersions = {
  cognitoidentityserviceprovider: "2016-04-18",
};
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
        const createGroup = (groupName) => {
          var params = {
            GroupName: groupName,
            UserPoolId: UserPoolId,
          };
          new AWS.CognitoIdentityServiceProvider().createGroup(params).promise();
        };
        createGroup(listing._id);
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
        const deleteGroup = (groupName) => {
          var params = {
            GroupName: groupName,
            UserPoolId: UserPoolId,
          };
          new AWS.CognitoIdentityServiceProvider().deleteGroup(params).promise();
        };
        deleteGroup(event.arguments.id);
        return deletedListing;
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
