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

// const users = [];
// const books = [];

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
    const newUser =[];
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    newUser.push({
      id: Date.now().toString(),
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      confirmPassword: hashedPassword
    });
    console.log(newUser);
    res.redirect('/book'); 
  } catch {
    res.redirect('/home');
  }
});

  app.get('/book', (req, res) => {
  res.render('book.ejs', { collectionOfbooks: collectionOfbooks });
  });


app.get('/api/book/:title', (req, res) => {
  const book = collectionOfbooks.find((book) => book.title == req.params.title);
  if (book) res.json(book);
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
    books.push(newBook);
    console.log(books);
    res.redirect('/book');
    
  } catch (error) {
    console.error(error);
    res.redirect('/home'); 
  }
});
 




app.delete('/remove/:title', function(req, res){
    
})


app.listen(port, () => {
  console.log('Server is running on port', port);
});

