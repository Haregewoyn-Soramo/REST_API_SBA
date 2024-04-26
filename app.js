const express = require('express');
const bcrypt = require('bcrypt');
const ejs = require('ejs');
const path = require('path');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const collectionOfbooks = require('./book-collection/collections.js')

const users = [];
const books = [];

app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));

app.set('view engine', 'ejs');
// app.use(express.urlencoded({  extended: false }));

app.get('/home', (req, res) => {
  res.render('home.ejs');
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.post('/login', async function (req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });
    console.log(users);
    res.redirect('/book'); 
  } catch {
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

app.get('/book', function(req, res){
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
    books.push(newBook);
    console.log(books);
    res.redirect('/book');
    
  } catch (error) {
    console.error(error);
    res.redirect('/home'); 
  }
});

function toggleZoom(card) {
  card.classList.toggle('zoomed');
}


app.listen(port, () => {
  console.log('Server is running on port', port);
});

app.delete('/remove/:title', function(req, res){
    
})
