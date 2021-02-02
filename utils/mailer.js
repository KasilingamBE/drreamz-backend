const AWS = require("aws-sdk");

const html = (message) => {
  return `<div>${message}</div>`;
};

exports.mailer = (data) => {
  const params = {
    Template: data.templateName,
    Destination: {
      ToAddresses: data.emails,
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: data.subject,
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html(data.message),
        },
      },
    },
    Source: process.env.SENDER_EMAIL,
  };
  return (sendPromise = new AWS.SES().sendEmail(params).promise());
};
