const DB = require("../../utils/DB");
const HomePage = require("./utils/homepageModel");
const { mailer } = require("../../utils/mailer");
const { sendTemplateEmail } = require("../../utils/sendTemplateEmail");


DB();

exports.handler = async (event) => {
  try {
    // switch (event.type) {
    //   case "updateHomepageEmailTask":
    //     return await HomePage.create({Email_id: event.arguments.Email_id,
    //                                     });
    

  
    // callback(null, "Submitting Email");
    //                                   }
  const tempData = {
    emails: [event.arguments.Email_id],
    subject: "Test Email",
    message: "Testing SES on backend",
  };
    return await mailer(tempData);
  // default:
  //     return null;
    // }
  
  }
  catch (error) {
    throw error;
  }
  
 
    
  
};