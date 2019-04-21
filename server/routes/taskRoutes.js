const express = require('express')
const moment = require('moment')

var Task = require("../models/task");
const router = express.Router()

/**
* @api {get} /api/tasks Get tasks
* @apiName Get all tasks
* @apiPermission none
* @apiGroup Task
*
* Sorting/Filtering included in query params
*
* @queryParam  {Date} [date] Date
* @queryParam  {Boolean} [done] Done
* @queryParam  {Boolean} [overdue] Overdue
*
* @apiSuccess (200) {Object} mixed `Task` object
*/
router.get('/tasks', (req, res) => {
  var filter = {};

  if (Object.keys(req.query).length) {
    // DATE filter
    if (("date" in req.query) && req.query.date && req.query.date.length) {
      // Check that date parameter is valid
      if (moment(req.query.date).isValid() == false) {
        res.send({ status: false, error: "Date parameter is not valid"})
        return
      }
      filter = {
        date: {
          $gte: moment(req.query.date).startOf('day').toDate(),
          $lte: moment(req.query.date).endOf('day').toDate()
        }
      }
    }
    if ((("startDate" in req.query) && req.query.startDate && req.query.startDate.length) &&
       (("endDate" in req.query) && req.query.endDate && req.query.endDate.length)) {

      // Check that date parameter is valid
      if (moment(req.query.startDate).isValid() == false || moment(req.query.endDate).isValid() == false) {
        res.send({ status: false, error: "Date parameter is not valid"})
        return
      }
      filter = {
        date: {
          $gte: moment(req.query.startDate).startOf('day').toDate(),
          $lte: moment(req.query.endDate).endOf('day').toDate()
        }
      }
    }
    // Done parameter has to be either true or false
    else if (("done" in req.query) && (req.query.done === 'true' || req.query.done === 'false')) {
      filter = {
        done: req.query.done == 'true'
      }
    }
    // Overdue tasks, by definition, due before today and not completed
    else if (("overdue" in req.query) && (req.query.overdue === 'true' || req.query.overdue === 'false')) {
      filter = {
        date: {
          $lte: moment().startOf('day').toDate()
        },
        done: false
      }
    }
  }

  Task.find(filter, 'name description date done', function (error, tasks) {
    if (error) {
      console.error(error);
      res.send({ status: false, error: error })
    }
    res.send({ status: true, tasks: tasks })

  }).sort({date:-1})

});


/**
* @api {post} /api/tasks Post a new task
* @apiName Get all tasks
* @apiPermission none
* @apiGroup Task
*
* Sorting/Filtering included in query params
*
* @apiParam  {String} [name] Name of task - required
* @apiParam  {String} [description] Description of task
* @apiParam  {Boolean} [done] Done
* @apiParam  {Date} [date] Date
*
* @apiSuccess (200) {Object} mixed `Task` object
*/
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

/**
* GET task by specific id
*
* @param id
* @return array
*/
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