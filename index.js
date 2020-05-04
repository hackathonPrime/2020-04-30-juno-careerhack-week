const express = require('express');
const bodyParser = require('body-parser');
// const DataService = require('./services/data-service');
const mongoose = require('mongoose');
require('mongoose-type-url');
// const url = 'mongodb://127.0.0.1:27017/mintbean';
const uri = 'mongodb://heroku_tbc5rlvh:v65i16p1fpj7c428prk7bbqsam@ds311128.mlab.com:11128/heroku_tbc5rlvh'
const db = mongoose.connection;

//connect to the mongoDB

const classmates = [
  {
    "title": "The Best Medium-Hard Data Analyst SQL Interview Questions  ",
    "description": "The first 70% of SQL is pretty straightforward but the remaining 30% can be pretty tricky.",
    "link": "https://quip.com/2gwZArKuWk7W",
  },
  {
    "title": "Nintendo says Tom Nook is a ‘good guy.’",
    "description": "Tom Nook's redemption arch backstory",
    "link": "https://www.washingtonpost.com/video-games/2020/04/09/tom-nook-animal-crossing-not-evil/",
  },
  {
    "title": "Is this fungi *really* a fun guy?",
    "description": "I built a silly game called “Is this fungi a fun guy” for a class project a few months ago. I mainly decided to do this quiz because I had just recently watched “Fantastic Fungi,” a documentary about mushrooms and how important and interesting they are in the natural world. It blew me away, and it seemed like a funny and interesting concept for a true/false quiz game.",
    "link": "https://medium.com/@mikeleriche/is-this-fungi-really-a-fun-guy-a450f37b6158",
  },
  {
    "title": "My Beer Selection",
    "description": "I created this web application to allow my users to make personal beer selections based on their tastes. Using beer data from PUNK API, I made two separate forms — one for flavours and the other for food pairings. Using each form, users can get a beer recommended based on their choice.",
    "link": "https://medium.com/@claudiamhahn/my-beer-selection-e9eb2f1f23ae",
  },
  {
    "title": "Learning Code with ADHD: Lists",
    "description": "hings have been rather chaotic lately, and the stress of Covid and everything around it made things a little harder to keep track of lately. ",
    "link": "https://medium.com/@ECSYoungCodes/learning-code-with-adhd-lists-b464d239c3ba",
  },
  {
    "title": "Perfectionism and Web Development",
    "description": "My perfectionism has never really bothered me or impacted me professionally. ",
    "link": "https://medium.com/@steph.vm.kerr/perfectionism-and-web-development-e7a59cd7e631",
  },
  {
    "title": "Tighten Up: How Learning React.js Helped Me Code Differently",
    "description": "I am currently on the cusp of week eight of nine of bootcamp at Juno College in Toronto, and the last 2 weeks have transformed the way I approach both my code and my view of the world.",
    "link": "https://medium.com/@afuafrimpong4/tighten-up-how-learning-react-js-helped-me-code-differently-cfa81e1b89f2",
  },
  {
    "title": "Welcome to the Jam: web development in the age of Space Jam",
    "description": "Ever since starting my web development journey, it’s become really interesting to inspect the code on various websites and see all the different approaches that developers take.",
    "link": "https://medium.com/@brittsays/welcome-to-the-jam-web-development-in-the-age-of-space-jam-e60f88eccc08",
  },
  {
    "title": "Navigating the Divide Between the Screen and the Self",
    "description": "Hello friends. The last time we spoke I had just finished my first week of coding bootcamp. Over the last two weeks there have been a lot of late nights, early mornings, weekends spent working tirelessly to complete projects, and hours spent debugging issues that typically concluded with a classic facepalm.",
    "link": "https://medium.com/@ken.taylor.codes/navigating-the-divide-between-the-screen-and-the-self-24f4989498c3",
  },
]

// mongoose.connect(url, { useNewUrlParser: true })
mongoose.connect(uri, function (err, db) {
  if (err) throw err;
  // db.collection('articles').insertMany(classmates, (err, res) => {
  //   if (err) console.log(err);
  //   console.log('number of documents inserted: ' + res.insertedCount)
  // }).save()
})



//check if connection succeeds
db.once('open', _ => {
  console.log('Database connected: ', uri)
})

db.on('error', err => {
  console.error('Connection error: ', err)
})
//define a schema

const Schema = mongoose.Schema;

// const userSchema = new Schema({
//   signupUsername: 'string',
//   email: 'string',
// });

const commentSchema = new Schema({
  comment: 'string', 
  username: 'string', 
  email: 'string',
  articleID: 'string'
}, {timestamps: {createdAt: 'created_at'}})

//add 
const articleSchema = new Schema({
  title: 'string',
  link: 'string',
  description: 'string',
  votes: Number,
  comments: [commentSchema]
}, {timestamps: {createdAt: 'created_at'}})

//when you comment, get li id for database entry
//get username from firebase.auth obj
//





//compile a model

//somehow connect oauth to this
// const User = mongoose.model('User', userSchema);
const Article = mongoose.model('Article', articleSchema);
const Comment = mongoose.model('Comment', commentSchema);

//delete all
// Article.deleteMany({}, function (err) {
//   if (err) console.log(err);
//   console.log('successful deletion')
// });


// Create the server app
const app = express();

// register the ./public folder as the static assets directory
app.use(express.static('public'));

// express needs this in order to be able to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// This dataService currently contains the data.
// You will be hooking it up to Mongo as part of your assignment.

// const dataService = new DataService();


// =========== API ROUTES ===========

// List all the data.
// GET /api/data
// app.get('/api/data', async (req, res) => {
//   const list = await dataService.all()


//   res.json(list);
// });

app.get('/api/data/articles', async (req, res) => {
  try {
    const result = await Article.find().exec()
    res.send(result)
  } catch (err) {
    res.send(err)
  }
})

app.get('/api/data/comments', async (req, res) => {
  try {
    const result = await Comment.find().exec()
    res.send(result)
  } catch (err) {
    res.send(err)
  }
})

// Save a data object
// POST /api/data
// SAMPLE PAYLOAD: { title: "Your title goes here", description: "Your description goes here" }
// app.post('/api/data', async (req, res) => {
//   // TODO:
//   // 1. Validate the existence of 'title'
//   // 2. Validate the existence of 'description'
//   const newObj = await dataService.create(req.body)
//   res.json(newObj);
// });

app.post('/api/data/articles', async (req, res) => {
  try {
    const article = new Article(req.body);
    const result = await article.save();
    res.send(result)
  } catch (err) {
    res.status(500).send(err);
  }
})

app.post('/api/data/comments', async (req, res) => {
  try {
    const comment = new Comment(req.body)
    const result = await comment.save();
    res.send(result)
  } catch (err) {
    res.status(500).send(err)
  }
})




// Start the application
const listener = app.listen(process.env.PORT || 3000, () => {
  // get the port from the listener.
  const port = listener.address().port;
  
  // log the port, so everyone knows where it has been deployed.
  console.log(`Now listening on port ${port}`)
});
