const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const fs = require('fs');
const clientSessions = require('client-sessions');
const randomstring = require('randomstring');
const path = require('path');
const linebyline = require('linebyline');

app.engine('hbs', hbs({ extname: 'hbs' }));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));