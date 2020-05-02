const mongoose = require('mongoose')
require('mongoose-type-url')
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


const articleSchema = new Schema({
  title: 'string',
  url: mongoose.SchemaTypes.Url
})

//compile a model

module.exports = mongoose.model('Article', articleSchema)
