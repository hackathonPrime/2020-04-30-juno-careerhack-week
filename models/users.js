const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/mintbean'


//connect to the mongoDB

mongoose.connect(url, { useNewUrlParser: true })


const db = mongoose.connection

//check if connection succeeds
db.once('open', _ => {
  console.log('Database connected: ', url)
})

db.on('error', err => {
  console.error('Connection error: ', err)
})

//define a schema

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: 'string',
  password: 'string',
  comments: 'string'
});

//compile a model

//somehow connect oauth to this
module.exports = mongoose.model('User', userSchema);


