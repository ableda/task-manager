import Api from '@/services/Api'

export default {
  // Get all tasks
  fetchAllTasks () {
    return Api().get('tasks')
  },

  // Get Tasks based on date/complete filters (today, tomorrow, overdue, done)
  fetchFilterTasks (params) {
    return Api().get('tasks', {params: params})
  },

  // Post new task
  addTask (params) {
    return Api().post('tasks', params)
  },

  // Get specific task by id
  getTask (params) {
    return Api().get('tasks/' + params.id)
  },

  // Update Task by id
  updateTask (params) {
    return Api().put('tasks/' + params.id, params)
  },

  // Delete Task
  deleteTask (id) {
    return Api().delete('tasks/' + id)
  }
}
