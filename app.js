const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const { logIn, createUser } = require("./controllers/users");

const mainRouter = require("./routes/index");
const clothingItemsRouter = require("./routes/clothingItems");
const usersRouter = require("./routes/users");
const cors = require("cors");

const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());

//signin/signuproutes:
app.post("/signin", logIn);
app.post("/signup", createUser);

// app.use((req, res, next) => {
//   req.user = {
//     _id: "5d8b8592978f8bd833ca8133", // paste the _id of the test user created in the previous step
//   };
//   next();
// });

// app.use("/items", clothingItemsRouter);
// app.use("/users", usersRouter);
app.use("/", mainRouter);
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
