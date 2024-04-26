module.exports = function(app){

  const users = [];
  const books = [];

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

}


