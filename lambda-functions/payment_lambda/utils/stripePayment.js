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
  // console.log(paymentIntent.client_secret);
  return paymentIntent.client_secret;
};

const createPaymentIntentOffline = async (data) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: data.amount,
    currency: "usd",
    customer: data.customer,
    payment_method: data.payment_method,
    off_session: true,
    confirm: true,
    application_fee_amount: data.fee,
    transfer_data: {
      destination: data.account,
    },
  });
  // console.log(paymentIntent.client_secret);
  return paymentIntent.client_secret;
};

const createSetupIntent = async (data) => {
  const intent = await stripe.setupIntents.create({
    customer: data.customer,
  });
  // console.log(intent.client_secret);
  return intent.client_secret;
};

const createCustomer = async (data) => {
  const customer = await stripe.customers.create({
    email: data.email,
    name: data.name,
  });
  // console.log(customer.id);
  return customer.id;
};

const listPaymentMethods = async (data) => {
  const paymentMethods = await stripe.paymentMethods.list({
    customer: data.customer,
    type: "card",
  });
  // console.log(paymentMethods.data);
  return paymentMethods.data;
};

const retrievePaymentMethod = async (data) => {
  const paymentMethod = await stripe.paymentMethods.retrieve(
    data.payment_method
  );
  // console.log(paymentMethod);
  return paymentMethod;
};

const detachPaymentMethod = async (data) => {
  const paymentMethod = await stripe.paymentMethods.detach(data.payment_method);
  // console.log(paymentMethod);
  return "true";
};

const dataP = {
  account: "acct_1HgQ2zIIQMfBcets",
  amount: 1000,
  fee: 10,
  email: "contactvivekvt@gmail.com",
  name: "Vivek Thakur",
  customer: "cus_IHsT6oMO3C6GzL",
  payment_method: "pm_1HhIteDPrb5EfwdRsERcvDuI",
};

// createPaymentIntent(dataP);
// createPaymentIntentOffline(dataP);
// createCustomer(dataP);
// createSetupIntent(dataP);
// listPaymentMethods(dataP);
// detachPaymentMethod(dataP);
// retrievePaymentMethod(dataP);

// parkyourselfbackend/lambda-functions/payment_lambda/utils/stripePayment.js

module.exports = {
  createPaymentIntent: createPaymentIntent,
  createPaymentIntentOffline: createPaymentIntentOffline,
  createSetupIntent: createSetupIntent,
  createCustomer: createCustomer,
  listPaymentMethods: listPaymentMethods,
  retrievePaymentMethod: retrievePaymentMethod,
  detachPaymentMethod: detachPaymentMethod,
};
