const AWS = require("aws-sdk");
const DB = require("../../utils/DB");
const StripeConnect = require("./utils/stripeConnectModel");
const StripeCustomer = require("./utils/stripeCustomerModel");
const StripeConnectMethods = require("./utils/stripeConnect");
const StripePayment = require("./utils/stripePayment");
DB();

const UserPoolId = process.env.USER_POOL_ID;

const getUser = (sub) => {
  var params = {
    UserPoolId: UserPoolId,
    Username: sub,
  };
  return (sendPromise = new AWS.CognitoIdentityServiceProvider()
    .adminGetUser(params)
    .promise());
};

exports.handler = async (event) => {
  try {
    let tempDriver = null;
    let tempOwner = null;
    let newCustomer = null;
    let tempCustomer = null;
    switch (event.type) {
      case "stripeCreateAccountLinks":
        const user2 = await StripeConnect.findOne({
          userId: event.arguments.userId,
        });
        if (user2) {
          const link = await StripeConnectMethods.createAccountLinks({
            account: user2.account,
            type: event.arguments.type,
            refresh_url: event.arguments.refresh_url,
            return_url: event.arguments.return_url,
          });
          return JSON.stringify(link);
        } else {
          const newAccount = await StripeConnectMethods.createAccount({
            email: event.arguments.email,
          });
          const newUser = await StripeConnect.create({
            userId: event.arguments.userId,
            account: newAccount.id,
          });
          const newLink = await StripeConnectMethods.createAccountLinks({
            account: newUser.account,
            type: event.arguments.type,
            refresh_url: event.arguments.refresh_url,
            return_url: event.arguments.return_url,
          });
          return JSON.stringify(newLink);
        }
      case "stripeRetrieveAccount":
        const user3 = await StripeConnect.findOne({
          userId: event.arguments.userId,
        });
        if (user3) {
          return JSON.stringify(
            await StripeConnectMethods.retrieveAccount({
              account: user3.account,
            })
          );
        } else {
          return null;
        }
      case "stripeCreateLoginLinkAccount":
        const user4 = await StripeConnect.findOne({
          userId: event.arguments.userId,
        });
        if (user4) {
          return JSON.stringify(
            await StripeConnectMethods.createLoginLinkAccount({
              account: user4.account,
            })
          );
        } else {
          return null;
        }
      case "stripeCreatePaymentIntent":
        tempDriver = await StripeCustomer.findOne({
          userId: event.arguments.driverId,
          type: event.arguments.type,
        });
        if (tempDriver) {
          tempOwner = await StripeConnect.findOne({
            userId: event.arguments.ownerId,
          });
          if (tempOwner) {
            return await StripePayment.createPaymentIntent({
              ...event.arguments,
              account: tempOwner.account,
              customer: tempDriver.customer,
            });
          } else {
            return null;
          }
        } else {
          newCustomer = await StripePayment.createCustomer({
            email: event.arguments.email,
            name: event.arguments.name,
          });
          tempCustomer = await StripeCustomer.create({
            userId: event.arguments.driverId,
            customer: newCustomer,
            type: event.arguments.type,
          });
          tempOwner = await StripeConnect.findOne({
            userId: event.arguments.ownerId,
          });
          if (tempOwner) {
            return await StripePayment.createPaymentIntent({
              ...event.arguments,
              account: tempOwner.account,
              customer: tempCustomer.customer,
            });
          } else {
            return null;
          }
        }

      case "stripeCreatePaymentIntentOffline":
        tempDriver = await StripeCustomer.findOne({
          userId: event.arguments.driverId,
          type: event.arguments.type,
        });
        tempOwner = await StripeConnect.findOne({
          userId: event.arguments.ownerId,
        });
        if (tempDriver && tempOwner) {
          return await StripePayment.createPaymentIntentOffline({
            ...event.arguments,
            customer: tempDriver.customer,
            account: tempOwner.account,
          });
        } else {
          return null;
        }
      case "stripeCreateSetupIntent":
        tempDriver = await StripeCustomer.findOne({
          userId: event.arguments.driverId,
          type: event.arguments.type,
        });
        if (tempDriver) {
          return await StripePayment.createSetupIntent({
            customer: tempDriver.customer,
          });
        } else {
          newCustomer = await StripePayment.createCustomer({
            email: event.arguments.email,
            name: event.arguments.name,
          });
          tempCustomer = await StripeCustomer.create({
            userId: event.arguments.driverId,
            customer: newCustomer,
            type: event.arguments.type,
          });
          return await StripePayment.createSetupIntent({
            customer: tempCustomer.customer,
          });
        }
      case "stripeListUserCards":
        tempDriver = await StripeCustomer.findOne({
          userId: event.arguments.driverId,
          type: event.arguments.type,
        });
        if (tempDriver) {
          return JSON.stringify(
            await StripePayment.listPaymentMethods({
              customer: tempDriver.customer,
            })
          );
        } else {
          return null;
        }
      case "stripeGetPaymentMethod":
        return JSON.stringify(
          await StripePayment.retrievePaymentMethod({
            payment_method: event.arguments.payment_method,
          })
        );
      case "stripeDetachPaymentMethod":
        return await StripePayment.detachPaymentMethod({
          payment_method: event.arguments.payment_method,
        });
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
