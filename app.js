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
app.use(requestLogger);

app.use(express.static(path.join(__dirname,'public')));

app.set('view engine', 'ejs');
// app.use(express.urlencoded({  extended: false }));

function checkEmptyBody(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send('Request body cannot be empty');
  }
  next();
}

app.post('/api/users', checkEmptyBody, (req, res) => {
  res.send('User created successfully');
});

app.post('/api/posts', checkEmptyBody, (req, res) => {
  res.send('This route should never be reached');
});


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

app.route('/api/book/:title')
  .get((req, res, next) => {
    const book = collectionOfbooks.find((book) => book.title === req.params.title);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  })

 .patch((req, res, next) => {
  const bookIndex = collectionOfbooks.findIndex((book) => book.title === req.params.title);
  if (bookIndex !== -1) {
    const bookToUpdate = collectionOfbooks[bookIndex];
    for (const key in req.body) {
      if (Object.hasOwnProperty.call(req.body, key)) {
        bookToUpdate[key] = req.body[key];
      }
    }
    collectionOfbooks[bookIndex] = bookToUpdate;
    res.json(bookToUpdate);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
})
   .delete((req, res, next) => {
    const bookIndex = collectionOfbooks.findIndex((book) => book.title === req.params.title);
    if (bookIndex !== -1) {
      const deletedBook = collectionOfbooks.splice(bookIndex, 1)[0];
      res.json(deletedBook);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  });

  function requestLogger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  }

app.listen(port, () => {
  console.log('Server is running on port', port);
});

