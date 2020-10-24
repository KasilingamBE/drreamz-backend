const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  roles:[String],
  topic:{
      type:String,
      required:true
  },
  question:{
    type:String,
    required:true
},
answer:{
    type:String,
    required:true
},
  createdAt:{
    type:String,
    default:new Date().toString()
  }
});

const Faq = mongoose.model("Faq", faqSchema);

module.exports = Faq;