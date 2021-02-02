const AWS = require("aws-sdk");

const html = (message) => {
  return `<div>${message}</div>`;
};

exports.sendTemplateEmail = (data) => {
  const params = {
    Template: data.templateName,
    Destination: {
      ToAddresses: data.emails,
    },
    Source: process.env.SENDER_EMAIL,
    TemplateData: JSON.stringify(data || {}),
  };
  return (sendPromise = new AWS.SES().sendTemplatedEmail(params).promise());
};