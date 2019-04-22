const express = require('express')
const moment = require('moment')

var Task = require("../models/task");
const router = express.Router()

/**
 * @swagger
 * definition:
 *   tasks:
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       done:
 *         type: boolean
 *       date:
 *         type: string
 */
/**
 * @swagger
 * /tasks:
 *   get:
 *     tags:
 *       - tasks
 *     description: Return tasks
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: date
 *         in: query
 *         description: Filter tasks by single date, any time of day will work
 *       - name: startDate
 *         in: query
 *         description: Filter tasks by start and end date.
 *       - name: endDate
 *         in: query
 *         description: Filter tasks by start and end date.
 *       - name: done
 *         in: query
 *         description: Filter tasks by those which are done or not done.
 *         schema:
 *           type: boolean
 *       - name: overdue
 *         in: query
 *         description: Filter tasks by those which are overdue (past date and not done).
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: status [true, false], array of tasks
 *         schema:
 *           $ref: '#/definitions/tasks'
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
    else if ((("startDate" in req.query) && req.query.startDate && req.query.startDate.length) &&
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
      filter = { done: req.query.done == 'true' }
    }
    // Overdue tasks, by definition, due before today and not completed
    else if (("overdue" in req.query) && (req.query.overdue === 'true' || req.query.overdue === 'false')) {
      filter = {
        date: { $lte: moment().startOf('day').toDate() },
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
 * @swagger
 * /tasks:
 *   post:
 *     tags:
 *       - tasks
 *     description: Creates a new task
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: task
 *         description: task object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/tasks'
 *     responses:
 *       200:
 *         description: Task saved successfully!
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
 * @swagger
 * /tasks/{id}:
 *   get:
 *     tags:
 *       - tasks
 *     description: Returns a single task
 *     produces: application/json
 *     parameters:
 *       - name: id
 *         description: tasks' id
 *         in: path
 *         required: true
 *         type: string

 *     responses:
 *       200:
 *         description: Task updated successfully!
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

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     tags:
 *       - tasks
 *     description: Updates a single task
 *     produces: application/json
 *     parameters:
 *       name: task
 *       in: body
 *       description: Fields for the task resource
 *       schema:
 *         type: array
 *         $ref: '#/definitions/tasks'
 *     responses:
 *       200:
 *         description: Task updated successfully!
 */
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
      res.send({ status: true, message: "Task updated successfully!"})
    })
  })
})

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     tags:
 *       - tasks
 *     description: Deletes a single task
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: tasks' id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully!
 */
router.delete('/tasks/:id', (req, res) => {
  var db = req.db;
  Task.deleteOne({
    _id: req.params.id
  }, function(error, task){
    if (error) {
      console.log(error);
      res.send({ status: false, error: error })
    }
    res.send({ status: true, message: "Task deleted successfully!" })
  })
})

module.exports = router
