const request = require('supertest')
const chai = require('chai');

const Task = require('../models/task')
const app = require('../src/app')
let should = chai.should();
let assert = chai.assert;

// Config file & DB Setup
var config = require('../src/config');
var mongoose = require('mongoose');
var moment = require('moment')


describe('CRUD API Tests', () => {
    let taskId = ''

	it('Creates a task', done => {
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
            res.body.status.should.be.eql(true)
            res.body.message.should.be.eql('Task saved successfully!')
            done()
		})
	})

    it('Gets all tasks', done => {
        request(app)
        .get('/api/tasks')
        .expect(200)
        .end((err, res) => {
            if (err) {
                return assert.fail(JSON.stringify(res))
            }
            res.body.status.should.be.eql(true)
            res.body.tasks.length.should.be.gt(0)

            // Check that task contains all appropiate properties
            var taskOne = res.body.tasks[0]
            taskOne.should.have.property('_id')
            taskOne.should.have.property('name')
            taskOne.should.have.property('description')
            taskOne.should.have.property('done')
            taskOne.should.have.property('date')

            // Save task Id to edit and delete later
            taskId = taskOne._id

            taskOne.name.should.be.eql("Name Test")
            taskOne.description.should.be.eql("Description Test")
            taskOne.done.should.be.eql(false)

            // Check that date is valid and in the same day
            moment(taskOne.date).isValid().should.be.eql(true)
            moment(taskOne.date).diff(moment(), 'days').should.be.lt(1)

            done()
        })
    })

    it('Updates tasks', done => {
        request(app)
        .put('/api/tasks/'+ taskId)
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
            res.body.status.should.be.eql(true)
            res.body.message.should.be.eql('Task updated successfully!')
            done()
        })
    })

    it('Gets tasks by id', done => {
        request(app)
        .get('/api/tasks/'+ taskId)
        .expect(200)
        .end((err, res) => {
            if (err) {
                return assert.fail(JSON.stringify(res))
            }
            res.body.status.should.be.eql(true)

            // Check task has all properties
            res.body.task.should.have.property('_id')
            res.body.task.should.have.property('name')
            res.body.task.should.have.property('description')
            res.body.task.should.have.property('done')
            res.body.task.should.have.property('date')

            res.body.task.name.should.be.eql("Name Test Edit")
            res.body.task.description.should.be.eql("Description Test Edit")
            res.body.task.done.should.be.eql(true)

            // Check that date is valid and in the same day
            moment(res.body.task.date).isValid().should.be.eql(true)
            moment(res.body.task.date).diff(moment(), 'days').should.be.lt(1)

            done()
        })
    })

    it('Deletes task by id', done => {
        console.log("running delete request");
        request(app)
        .delete('/api/tasks/' + taskId)
        .expect(200)
        .end((err, res) => {
            if (err) {
                return assert.fail(JSON.stringify(res))
            }
            res.body.status.should.be.eql(true)
            res.body.message.should.be.eql('Task deleted successfully!')
            done()
        })
    })
})

// All filter tests would come next
/*
describe('GET Filter Tests', () => {
    let taskId = ''

	it('Creates a couple of tasks', done => {
		request(app)
		.post('/api/tasks')
		.send(new Task({
		    name: "Today Test",
		    description: "Today Description",
		    done: false,
		    date: new Date()
		 }))
		.expect(200)
		.end((err, res) => {
			if (err) {
				return assert.fail(JSON.stringify(res))
			}
            res.body.status.should.be.eql(true)
            res.body.message.should.be.eql('Task saved successfully!')
            done()
		})
	})

    it('Get no data for tomorrow', done => {
        request(app)
        .get('/api/tasks')
        .send(new Task({
            name: "Today Test",
            description: "Today Description",
            done: false,
            date: new Date()
         }))
        .expect(200)
        .end((err, res) => {
            if (err) {
                return assert.fail(JSON.stringify(res))
            }
            res.body.status.should.be.eql(true)
            res.body.message.should.be.eql('Task saved successfully!')
            done()
        })
    })
})
*/
