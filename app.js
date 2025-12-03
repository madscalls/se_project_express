const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

const app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  req.user = {
    _id: '690d6b2f7256ef523081eecb',
  };
  next();
});

app.use('/', routes);

// start server when this file is run directly
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
