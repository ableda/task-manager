var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
  name: String,
  description: String,
  date: { type: Date, default: Date.now },
  done: Boolean
});

var Task = mongoose.model("Task", TaskSchema);
module.exports = Task;