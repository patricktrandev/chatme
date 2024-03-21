import { IM_A_TEAPOT } from "http-status-codes";
import mongoose = require("mongoose");
import { config } from "./config";
import Logger = require("bunyan");
const logger: Logger = config.createLoggerConfig("setupDatabase");
export default () => {
  const connectDB = () => {
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        logger.info("Successfully connected to db.");
      })
      .catch((err) => {
        logger.error("Error connecting to database..");
        return process.exit(1);
      });
  };

  connectDB();
  mongoose.connection.on("disconnected", connectDB);
};
