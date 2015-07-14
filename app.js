var express    = require('express');
var bodyParser = require('body-parser');
var session    = require('express-session');

var knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL || "postgres://localhost/bookers"
});

var bookshelf   = require('bookshelf')(knex);
var knexCleaner = require('knex-cleaner');

var app         = express();

app.use(express.static(__dirname + '/views'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'theolovesgerard',
  resave: false,
  saveUninitialized: true
}));

// database setter-upper

knexCleaner.clean(knex).then(function() {
  console.log('database cleaned!');
});

var User = bookshelf.Model.extend({
  tableName: "users"
});

app.get('/', function(req, res) {
  res.sendFile('/index.html');
});

app.post('/users', function(req, res) {
  var user = new User({
    email: req.body.email,
    name:  req.body.name
  });
  user.save();
  user.fetch()
    .then(function(model) {
      return model.get('id');
    })
    .then(function(id) {
      req.session.user_id = id;
    })
    .then(function() {
      res.redirect('/welcome');
    });
});

app.get('/welcome', function(req, res) {
  User.forge({id: req.session.user_id})
    .fetch()
    .then(function(user) {
      return user.get('email');
    })
    .then(function(result) {
      res.send("hello world " + result);
    });
});

app.listen(3000, function() {
  console.log("Server running on port 3000");
});