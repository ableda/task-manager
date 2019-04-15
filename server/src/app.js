const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const routes = require('../routes/routes.js')
const posts = require('../routes/posts.js')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

// DB Setup
var mongoose = require('mongoose');

var DATABASE_URL = process.env.DATABASE_URL || 'http://localhost'
mongoose.connect(`mongodb://${DATABASE_URL}/posts`, { useNewUrlParser: true });

var db = mongoose.connection;

db.on('error', function (error) {
  // If first connect fails because server-database isn't up yet, try again.
  // This is only needed for first connect, not for runtime reconnects.
  // See: https://github.com/Automattic/mongoose/issues/5169
  if (error.message && error.message.match(/failed to connect to server .* on first connect/)) {
    setTimeout(function () {
      mongoose.connect(`mongodb://${DATABASE_URL}/posts`, { useNewUrlParser: true }).catch(() => {
        // empty catch avoids unhandled rejections
      });
    }, 20 * 1000);
  } else {
    // Some other error occurred.  Log it.
    console.error(new Date(), String(error));
  }
});

db.once("open", function(callback){
  console.log("Connection Succeeded");
});

// Route set up
app.use('/api', routes)
app.use('/', posts)

app.listen(process.env.PORT || 8081)
