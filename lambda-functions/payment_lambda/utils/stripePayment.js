const stripe = require("stripe")(process.env.STRIPE_SECRET);

const createPaymentIntent = async (data) => {
  const paymentIntent = await stripe.paymentIntents.create({
    payment_method_types: ["card"],
    amount: data.amount,
    currency: "usd",
    application_fee_amount: data.fee,
    transfer_data: {
      destination: data.account,
    },
  });
  console.log(paymentIntent.client_secret);
  return paymentIntent.client_secret;
};
const dataP = {
  account: "acct_1HgQ2zIIQMfBcets",
  amount: 1000,
  fee: 10,
};

createPaymentIntent(dataP);

module.exports = {
  createPaymentIntent: createPaymentIntent,
};
