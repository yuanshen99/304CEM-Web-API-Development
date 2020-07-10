const mongoose = require('mongoose');
const db = "mongodb+srv://p18010695webapi:p18010695webapi@cluster0-ogmkh.mongodb.net/TestConnect?retryWrites=true&w=majority";

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connected to database');
  })
  .catch(error => {
    console.log('Mongoose connetion error: ', error);
  });

const schema = mongoose.Schema({
  temp: { type: String },
  location: { type: String },
  station: { type: String },
  airpollution: { type: String },
  time:{type: String},
  url: { type: String },
  icon: { type: String },
  accessby:{type: String}
});

const schema1 = mongoose.Schema({
  key: { type: String },
  email: {type : String}
});
const Weather = mongoose.model('Weather', schema, 'weatherCollection');
const ApiKey = mongoose.model('ApiKey', schema1,'keyCollection')

module.exports = {
  Weather: Weather,
  ApiKey: ApiKey
};