const stripe = require("stripe")(process.env.STRIPE_SECRET);

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
  return accountLinks;
};

const retrieveAccount = async (data) => {
  const account = await stripe.accounts.retrieve(data.account);
  return account;
};

const createLoginLinkAccount = async (data) => {
  const link = await stripe.accounts.createLoginLink(data.account);
  return link;
};

const dataL = {
  type: "account_onboarding", // "account_onboarding", // "account_update"
  account: "acct_1HgFFcGjqeUI8yCs", //acct_1HgExPDMpteJtjTs
  refresh_url: "https://example.com/reauth",
  return_url: "https://example.com/return",
};

const dataA = {
  email: "contactvivekvt@gmail.com",
};

// createAccount(dataA);
// retrieveAccount(dataL);
// createLoginLinkAccount(dataL);
// createAccountLinks(dataL);

module.exports = {
  createAccount: createAccount,
  createAccountLinks: createAccountLinks,
  retrieveAccount: retrieveAccount,
  createLoginLinkAccount: createLoginLinkAccount,
};
