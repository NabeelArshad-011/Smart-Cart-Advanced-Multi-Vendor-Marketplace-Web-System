const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`mongod connected with server: ${data.connection.host}`);
    })
    .catch((error) => {
      console.error(`Database connection failed: ${error.message}`);
      process.exit(1);
    });
};

module.exports = connectDatabase;
