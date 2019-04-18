import Api from '@/services/Api'

export default {
  // Get all tasks
  fetchTasks () {
    return Api().get('tasks')
  },

  // Post new task
  addTask (params) {
    return Api().post('tasks', params)
  },

  // Get specific task
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
