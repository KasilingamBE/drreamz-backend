const AWS = require("aws-sdk");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const DB = require("../../utils/DB");
const StripeConnect = require("./utils/stripeConnectModel");
const StripeConnectMethods = require("./utils/stripeConnect");
const StripePayment = require("./utils/stripePayment");
DB();

AWS.config.accessKeyId = process.env.AWS_ACCESS_D;
AWS.config.secretAccessKey = process.env.AWS_SECRET_D;
AWS.config.region = process.env.AWS_REGION_D;

const getUser = (sub) => {
  var params = {
    UserPoolId: "us-east-1_pHJygr7bF",
    Username: sub,
  };
  return (sendPromise = new AWS.CognitoIdentityServiceProvider()
    .adminGetUser(params)
    .promise());
};

exports.handler = async (event) => {
  try {
    let tempUser = null;
    switch (event.type) {
      case "createCheckoutSession":
        const { user, space, other } = event.arguments;
        const res = await getUser(space.ownerId);
        const ownerEmail = res.UserAttributes.filter(
          (a) => a.Name === "email"
        )[0].Value;
        const session = await stripe.checkout.sessions.create({
          success_url: other.success_url,
          cancel_url: other.cancel_url,
          payment_method_types: ["card"],
          customer_email: user.email,
          client_reference_id: space._id,
          line_items: [
            {
              name: `Parking near ${space.name}`,
              description: space.description,
              images: [space.image],
              amount: space.price * 100,
              currency: "usd",
              quantity: 1,
            },
          ],
          mode: "payment",
          metadata: {
            driverId: user._id,
            driverEmail: user.email,
            driverName: user.name,
            ownerId: space.ownerId,
            ownerEmail: ownerEmail,
            address: other.address,
            vehicle: other.vehicle,
            status: other.status,
            startTime: other.startTime,
            startDate: other.startDate,
            profileCategory: other.profileCategory,
            paymentMethod: other.paymentMethod,
            payment: other.payment,
            listingId: other.status,
            images: other.images[0],
            endTime: other.endTime,
            endDate: other.endDate,
          },
        });
        return JSON.stringify(session);
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
        tempUser = await StripeConnect.findOne({
          userId: event.arguments.ownerId,
        });
        if (tempUser) {
          return await StripePayment.createPaymentIntent({
            ...event.arguments,
            account: tempUser.account,
          });
        } else {
          return null;
        }
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
