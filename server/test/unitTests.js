const test = require('tape')
const request = require('supertest')
const express = require('express')

const Task = require('../models/task')
const app = require('../src/app')
let taskId

// Config file & DB Setup
var config = require('../src/config');
var mongoose = require('mongoose');

const dbName = process.env.NODE_ENV === 'dev' ? 'database-test' : 'database'

/*
* TESTS ONLY RUNNING after an initial post to the database
* It is then clearing the database every time... Is it the mongoose connections???
*/

// Need to connect to a test-database from config or environment file
before(done => {
	mongoose.connect(`mongodb://localhost/database-test`, { useNewUrlParser: true });
    mongoose.connection.once('connected', () => {
      done();
    });
})

after(done => {
	mongoose.disconnect();
	done();
});

describe('API Tests', () => {
	it('Runs all CRUD tests', done => {
		test('api/tasks', assert => {
			console.log("running first request");
			request(app)
				.post('/api/tasks')
				.send(new Task({
				    name: "Name Test",
				    description: "Description Test",
				    done: false,
				    date: new Date()
				 }))
				.expect(200)
				.end((err, res) => {
					if (err) {
						return assert.fail(JSON.stringify(res))
					}
					assert.equal(res.body.status, true)
					assert.equal(res.body.message, 'Task saved successfully!')
					assert.pass('Created a new task successfully, test passed')
					assert.end()
				})
		})

		test('/api/tasks', assert => {
			request(app)
				.get('/api/tasks')
				.expect(200)
				.end((err, res) => {
					if (err) {
						return assert.fail(JSON.stringify(res))
					}
					taskId = res.body.tasks[0]._id
					
					assert.equal(res.body.status, true)
					assert.notEqual(res.body.tasks.length, 0)
					assert.pass('Got all tasks successfully, test passed!')
					assert.end()
				})
		})

		test('api/tasks/:id', assert => {
			request(app)
				.get(`/api/tasks/${taskId}`)
				.expect(200)
				.end((err, res) => {
					if (err) {
						return assert.fail(JSON.stringify(res))
					}
					// TODO: check it was same task...
					assert.equal(res.body.status, true)
					assert.equal(res.body.task._id, taskId)
					assert.equal(res.body.task.done, false)
					assert.pass('Got a specific task successfully, test passed!', res)
					assert.end()
				})
		})

		test('/api/tasks/:id', assert => {
			request(app)
				.put(`/api/tasks/${taskId}`)
				.send(new Task({
				    name: "Name Test Edit",
				    description: "Description Test Edit",
				    done: true,
				    date: new Date()
				 }))
				.expect(200)
				.end((err, res) => {
					if (err) {
						return assert.fail(JSON.stringify(res))
					}
					assert.equal(res.body.status, true)
					assert.pass('Edited task successfully, test passed!')
					assert.end()
				})
		})

		test('/api/tasks/:id', assert => {
			console.log("Deleting task id: ", taskId);
			request(app)
				.delete(`/api/tasks/${taskId}`)
				.expect(200)
				.end((err, res) => {
					if (err) {
						return assert.fail(JSON.stringify(res))
					}
					assert.pass('Deleted a specific task successfully, test passed!')
					assert.end()
					done()
				})
		})
	})
})