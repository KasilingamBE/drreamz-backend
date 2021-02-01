const mongoose = require("mongoose");

const home_Schema = new mongoose.Schema({

    Email_id:{
        type: String,
    },
    
},
{
    collection: "homepage_email"
}
);

const HomePage = mongoose.model("HomePage", home_Schema);

module.exports = HomePage;