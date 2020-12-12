const mongoose = require("mongoose");
const DB_STRING =
  "mongodb+srv://vivekt:codemarketc@codemarket-staging.k16z7.mongodb.net/parkyourself?retryWrites=true&w=majority";
// const DB_STRING = process.env.DATABASE;

module.exports = async () => {
  try {
    await mongoose.connect(DB_STRING, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connection Successfull!");
  } catch (error) {
    console.log("DB Connection Failed");
  }
};
