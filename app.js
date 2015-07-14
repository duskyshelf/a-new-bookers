var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));


// database setter-upper
var knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL || "postgres://localhost/bookers"
});

var bookshelf = require('bookshelf')(knex);

var User = bookshelf.Model.extend({
  tableName: "users"
});

// configure views
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// configure public folder with built-in middleware express.static
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  // if there is a user signed up
  res.render('index');
});

app.post('/users', function(req, res) {
  User.forge({
    name: req.body.name,
    email: req.body.email
  })
  .save();
  User.forge({ email: req.body.email })
    .fetch()
    .then(function (user) {
      var currentUser = user;
      console.log(user.get());
      res.send('Welcome, ' + user.toJSON().email);
    });
});

app.listen(3000, function() {
  console.log("Server running on port 3000");
});
