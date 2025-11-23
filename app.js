const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const { logIn, createUser } = require('./controllers/users');

const mainRouter = require('./routes/index');
const clothingItemsRouter = require('./routes/clothingItems');
const usersRouter = require('./routes/users');

const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());

app.use('/', mainRouter);
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
