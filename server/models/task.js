var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  date: { type: Date, default: Date.now },
  done: { type: Boolean, default: false }
});

var Task = mongoose.model('Task', TaskSchema);
module.exports = Task;