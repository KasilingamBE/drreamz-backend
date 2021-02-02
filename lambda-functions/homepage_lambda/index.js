const DB = require("../../utils/DB");
const HomePage = require("./utils/homepageModel");
const { mailer } = require("../../utils/mailer");

DB();

exports.handler = async (event) => {
  try {
    switch (event.type) {
      case "updateHomepageEmailTask":
        return await HomePage.create({Email_id: event.arguments.Email_id,
                                        });
      
                                         }

  callback(null, "Submitting Email");
  const tempData = {
    emails: ["bilalmomin39@gmail.com"],
    subject: "Test Email",
    message: "Testing SES on backend",}
    
       
    }
  catch (error) {
    throw error;
  }
  
 
    
  
};