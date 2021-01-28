const mongoose = require("mongoose");

const jobUserSchema = new mongoose.Schema({
  fname: String,
  lname: String,
   slug: String,
  
});

jobUserSchema.index({ slug: 1 });

const JobUser = mongoose.model("JobUser",jobUserSchema );

module.exports = JobUser;