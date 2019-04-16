const express = require('express')

var Task = require("../models/task");
const router = express.Router()

// Task Endpoints
router.get('/tasks', (req, res) => {
  Task.find({}, 'name description date done', function (error, tasks) {
    if (error) {
      console.error(error);
      res.send({ status: false, error: error })
    }
    res.send({ status: true, tasks: tasks })

  }).sort({_id:-1})
});

router.post('/tasks', (req, res) => {
  var db = req.db;
  var new_task = new Task({
    name: req.body.name,
    description: req.body.description,
    done: req.body.done,
    date: req.body.date
  })

  new_task.save(function (error) {
    if (error) {
      console.log(error)
      res.send({ status: false, error: error.message })
    }
    res.send({ status: true, message: 'Task saved successfully!' })
  })
})

// Fetch single task
router.get('/tasks/:id', (req, res) => {
  var db = req.db;
  Task.findById(req.params.id, 'name description date done', function (error, task) {
    if (error) {
      console.error(error);
      res.send({ status: false, error: error })
    }
    res.send({status: true, task: task})
  })
})

// Update a task
router.put('/tasks/:id', (req, res) => {
  var db = req.db;
  Task.findById(req.params.id, 'name description date done', function (error, task) {
    if (error) { console.error(error); }

    task.name = req.body.name
    task.description = req.body.description || task.description
    task.done = req.body.done
    task.date = req.body.date || task.date

    task.save(function (error) {
      if (error) {
        console.log(error)
        res.send({ status: false, error: error.message })
      }
      res.send({ status: true, message: "Task updated successfully"})
    })
  })
})

// Delete a task
router.delete('/tasks/:id', (req, res) => {
  var db = req.db;
  Task.remove({
    _id: req.params.id
  }, function(error, task){
    if (error) {
      console.log(error);
      res.send({ status: false, error: error })
    }
    res.send({ status: true, message: "Task deleted successfully" })
  })
})

module.exports = router