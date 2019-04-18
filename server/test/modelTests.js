/*
* Test Mongoose Model
*/
var expect = require('chai').expect
    mongoose = require('mongoose')
    sinon = require('sinon');

describe('Models', function() {
  var Task;

  beforeEach(function(done) {
    mongoose.connect('mongodb://localhost/database-test', { useNewUrlParser: true });
    mongoose.connection.once('connected', () => {
      //mongoose.connection.db.dropDatabase();
      Task = require('../models/task')
      done();
    });
  });

  afterEach(function(done) {
    mongoose.disconnect();
    done();
  });

  describe('Lifecycle', function() {

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

});

// Model direct test
describe('task model', function() {
  var Task = require('../models/task');

  it('should be invalid if name is empty', function(done) {
    var task = new Task();

    task.validate(function(err) {
      expect(err.errors.name).to.exist;
      done();
    });
  });
});