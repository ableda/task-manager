/*
*  Node js Express application for CRUD of tasks in a todo list
*  Includes Swagger API Documentation from comments on every route (start comments with @swagger)
*
*  Author: Alex Bleda
*  Created: 04/15/2019
*/
// Dependencies
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

// Routes
const taskRoutes = require('../routes/taskRoutes.js')

// Swagger API Documentation
var swaggerUi = require('swagger-ui-express'),
    swaggerJSDoc = require('swagger-jsdoc');

// Config file
var config = require('./config');

// Express Instance
const app = express()

// Swagger definition
var swaggerDefinition = {
  info: {
    title: 'Task Management API',
    version: '1.0.0',
    description: 'CRUD Operations for getting, creating, editing and deleting tasks.',
  },
  host: config.api.url,
  basePath: config.api.base,
};
// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./**/routes/*.js','routes.js'],// pass all in array
  };

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

// DB Setup
var mongoose = require('mongoose');

mongoose.connect(`mongodb://${config.db.host}/${config.db.name}`, { useNewUrlParser: true });

var db = mongoose.connection;

db.on('error', function (error) {
  // If first connect fails because server-database isn't up yet, try again.
  // This is only needed for first connect, not for runtime reconnects.
  // See: https://github.com/Automattic/mongoose/issues/5169
  if (error.message && error.message.match(/failed to connect to server .* on first connect/)) {
    setTimeout(function () {
      mongoose.connect(`mongodb://${config.db.host}/${config.db.name}`, { useNewUrlParser: true }).catch(() => {
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

// Routes set up
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(config.api.base, taskRoutes)

app.listen(process.env.PORT || 8081, function() {
  app.emit('APP_STARTED')
})

module.exports = app
