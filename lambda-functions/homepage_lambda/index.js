const DB = require("../../utils/DB");
const HomePage = require("./utils/homepageModel");
const { mailer } = require("../../utils/mailer");
const { sendTemplateEmail } = require("../../utils/sendTemplateEmail");


DB();

exports.handler = async (event) => {
  try {
    switch (event.type) {
      case "updateHomepageEmailTask":
        return await HomePage.create({Email_id: event.arguments.Email_id,
                                        });
    

  callback(null, "Submitting Email");
 
  // exports.handler = async (event) => {
  //   const data = {
  //          email: [event.arguments.Email_id],
  //          templateName: "<demotemplate>",
  //          templateData: {},
  //        };
  //    return await sendTemplateEmail(data);
  //  }
  const tempData = {
    // templateName: ["sendTemplatedEmail"],
    emails: ["bilalmomin39@gmail.com"],
    subject: "Test Email",
    message: "Testing SES on backend",}
    return await mailer(tempData);
    default:
      return null;
    }
  
  }
  catch (error) {
    throw error;
  }
  
 
    
  
};