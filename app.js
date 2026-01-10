/* eslint-env node */

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errorLogger, requestLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes");

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connected to DB");
  })
  // eslint-disable-next-line no-console
  .catch(console.error);

app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use("/", routes);

app.use(errorLogger);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
