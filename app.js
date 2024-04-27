require('events').EventEmitter.defaultMaxListeners = 15;
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const collectionOfbooks = require('./book-collection/collections.js')
const userData = require('./book-collection/users.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));

app.set('view engine', 'ejs');
// app.use(express.urlencoded({  extended: false }));

app.get('/home', (req, res) => {
  res.render('home.ejs');
});
app.get('/api/user/:id',function(req, res){
  const users = userData.find(user => user.id = req.params.id );
  res.json(users);
})
app.get('/login', (req, res) => {
  res.render('login.ejs');
});

async function hashedPassword(users){
  for(user of users){
    const hashedPassword = await bcrypt.hash(user.password, saltRounds) 
    user.password = hashedPassword;
  }
}

hashedPassword(userData);

app.post('/login', async function(req, res){
  const user = userData.find(user => user.Email == req.body.email);
  if(user){
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if(passwordMatch){
      res.redirect('/book');
    } else {
      
      res.redirect('/home');
    }
  } else {
    res.redirect('/home');
  }
});

app.get('/register', (req, res) => { 
  res.render('register.ejs'); 
});


app.post('/register', async function (req, res) {
  try {
    const user = userData.find(user =>user.Email == req.body.email)
    if(user){
      res.redirect('/home')
      return;
    }
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      const newUser = {
      id: Date.now().toString(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
    };
    userData.push(newUser)
    console.log(newUser);

    res.redirect('/book'); 
   } catch(error) {
    console.log(error)
    res.redirect('/home');
   }
  });

  app.get('/book', (req, res) => {
  res.render('book.ejs', { collectionOfbooks: collectionOfbooks });
  });

app.get('/add', (req, res) => {
  res.render('add.ejs');
});

app.post('/add', function(req, res) {
  try {
    const newBook = {
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre, 
      date: req.body.date,
      description: req.body.description,
      image: req.body.image
    };
    collectionOfbooks.push(newBook);
    console.log(collectionOfbooks); 
    res.redirect('/book');
    
  } catch (error) {
    console.error(error);
    res.redirect('/home'); 
  }
});

 app
.route('/api/book/:title')
.get( (req, res, next) => {
  const book = collectionOfbooks.find((book) => book.title == req.params.title);
  if (book) res.json(book);
  else next();
 })

 .patch((req, res, next) =>{
  const book = collectionOfbooks.find((book, inx) =>{
    if(book.title == req.params.title){
      for(const key in req.body){
        book[inx][key] = req.body[key]
      }
      return true;
    }
  })
  if(book)
  res.json(book);
  next()
 })
  .delete((req, res, next) =>{
    const book = collectionOfbooks.find((book, inx) =>{
      if(book.title == req.params.title){
        collectionOfbooks.splice(inx, 1);
        return true;
      }
    })
    if(book) res.json(post);
    else next();
  });







app.listen(port, () => {
  console.log('Server is running on port', port);
});

