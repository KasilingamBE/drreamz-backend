// const stripe = require("stripe")(process.env.STRIPE_SECRET);
const stripe = require("stripe")(
  "sk_test_517LnJnDPrb5EfwdRn0RyqjqyLE5GOWY4Us7x5QZweDoxcvuE3IMa2uaTfmiH6xveoeJ9LhP1B6lRQ4ifr8ItccHa00rQxH8DHo"
);

const createAccount = async (data) => {
  const account = await stripe.accounts.create({
    country: "US",
    type: "express",
    email: data.email,
    capabilities: {
      card_payments: {
        requested: true,
      },
      transfers: {
        requested: true,
      },
    },
    settings: {
      payouts: {
        schedule: {
          interval: "manual",
        },
      },
    },
  });
  // console.log(account);
  return account;
};

const createAccountLinks = async (data) => {
  const accountLinks = await stripe.accountLinks.create({
    account: data.account,
    refresh_url: data.refresh_url,
    return_url: data.return_url,
    type: data.type,
  });
  // console.log("accountLinks", accountLinks);
  return accountLinks;
};

const createPayout = async (data) => {
  const payout = await stripe.payouts.create(
    {
      amount: data.amount,
      currency: "usd",
    },
    {
      stripeAccount: data.account,
    }
  );
  // console.log("payout", payout);
  return payout;
};

const retrieveAccount = async (data) => {
  const account = await stripe.accounts.retrieve(data.account);
  // console.log(account);
  return account;
};

const createLoginLinkAccount = async (data) => {
  const link = await stripe.accounts.createLoginLink(data.account);
  console.log(link);
  return link;
};

const dataL = {
  email: "tax@codemarket.io",
  type: "account_onboarding", // "account_onboarding", // "account_update"
  // account: "acct_1HgQ2zIIQMfBcets", //acct_1HgExPDMpteJtjTs
  account: "acct_1HovjvRU1JJZAjj7", // Tax Account
  refresh_url: "https://example.com/reauth",
  return_url: "https://example.com/return",
  amount: 1000,
  taxAccount: "acct_1HovjvRU1JJZAjj7",
};

// const dataA = {
//   email: "contactvivekvt@gmail.com",
// };

// createPayout(dataL);
// createAccount(dataL);
// retrieveAccount(dataL);
// createLoginLinkAccount(dataL);
// createAccountLinks(dataL);

module.exports = {
  createAccount: createAccount,
  createAccountLinks: createAccountLinks,
  retrieveAccount: retrieveAccount,
  createLoginLinkAccount: createLoginLinkAccount,
  createPayout: createPayout,
};

// node lambda-functions/payment_lambda/utils/stripeConnect.js
