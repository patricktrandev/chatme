import { IM_A_TEAPOT } from "http-status-codes";
import mongoose = require("mongoose");
import { config } from "./config";
export default () => {
  const connectDB = () => {
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        console.log("Successfully connected to db.");
      })
      .catch((err) => {
        console.log("Error connecting to database..");
        return process.exit(1);
      });
  };

  connectDB();
  mongoose.connection.on("disconnected", connectDB);
};
