/*
* Test Mongoose Model
*/
var expect = require('chai').expect
    mongoose = require('mongoose')
    sinon = require('sinon');

// Model direct test
describe('Task model', function() {
  var Task = require('../models/task');

  it('should be invalid if name is empty', function(done) {
    var task = new Task();

    task.validate(function(err) {
      expect(err.errors.name).to.exist;
      done();
    });
  });

  it('should not save without name', function(done) {
    var task = new Task({
      description: "task description without name"
    });

    task.save(function(err) {
      expect(err).to.exist
        .and.be.instanceof(Error)
        .and.have.property('message', 'Task validation failed: name: Path `name` is required.');
      done();
    });
  });
});
