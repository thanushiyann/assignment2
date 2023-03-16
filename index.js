const express = require('express');
const session = require('client-sessions');
const hbs = require('express-handlebars');
const fs = require('fs');
const path = require('path');
const randomstring = require('randomstring');
const lineByLine = require('n-readlines');
const userFile = 'user.json';

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
  cookieName: 'session',
  secret: randomstring.generate(),
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));

app.engine('hbs', hbs({ extname: 'hbs' }));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const liner = new lineByLine(userFile);
  let found = false;
  let line;
  while (line = liner.next()) {
    const data = line.toString('ascii').trim().split(':');
    if (email === data[0] && password === data[1]) {
      found = true;
      req.session.email = email;
      break;
    }
  }
  if (found) {
    res.redirect('/gallery');
  } else {
    res.render('login', { error: 'Invalid email or password' });
  }
});

app.get('/gallery', (req, res) => {
  if (req.session.email) {
    res.render('gallery', { email: req.session.email });
  } else {
    res.redirect('/');
  }
});

app.get('/logout', (req, res) => {
  req.session.reset();
  res.redirect('/');
});

app.listen(3000, () => console.log('Server is running at http://localhost:3000/'));