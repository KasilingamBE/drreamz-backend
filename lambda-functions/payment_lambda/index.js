const AWS = require("aws-sdk");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

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
          // customer:user._id,
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
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
