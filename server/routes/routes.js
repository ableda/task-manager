const express = require('express')

var Task = require("../models/tasks");
const router = express.Router()

// SERVER Setup
router.get('/tasks', (req, res) => {
  Task.find({}, 'title description', function (error, tasks) {
    if (error) { console.error(error); }
    res.send({
      tasks: tasks
    })
  }).sort({_id:-1})
});


// Task Endpoints
router.post('/tasks', (req, res) => {
  var db = req.db;

  var new_task = new Task({
    name: req.body.name,
    description: req.body.description,
    date: req.body.date,
    done: req.body.done
  })

  console.log(new_task, req.body)

  new_task.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Task saved successfully!'
    })
  })
})

// Fetch single task
router.get('/tasks/:id', (req, res) => {
  var db = req.db;
  Task.findById(req.params.id, 'title description', function (error, task) {
    if (error) { console.error(error); }
    res.send(task)
  })
})

// Update a task
router.put('/tasks/:id', (req, res) => {
  var db = req.db;
  Task.findById(req.params.id, 'title description', function (error, task) {
    if (error) { console.error(error); }

    task.name = req.body.name
    task.description = req.body.description
    task.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})

// Delete a task
router.delete('/tasks/:id', (req, res) => {
  var db = req.db;
  Task.remove({
    _id: req.params.id
  }, function(err, task){
    if (err)
      res.send(err)
    res.send({
      success: true
    })
  })
})


module.exports = router