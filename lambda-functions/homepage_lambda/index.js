const DB = require("../../utils/DB");
const HomePage = require("./utils/homepageModel");

DB();

exports.handler = async (event) => {
  try {
    switch (event.type) {
      case "updateHomepageEmailTask":
        return await HomePage.create({Email_id: event.arguments.Email_id,
                                        });
      
                                         }

  callback(null, "Submitting Email");

       
    }
  catch (error) {
    throw error;
  }
  
 
    
  
};