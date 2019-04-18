<template>
  <div class='tasks'>
    <h1>Tasks</h1>
    <div v-if="tasks.length > 0" class="table-wrap">
      <table>
        <tr>
          <td>Done</td>
          <td width="200">Due Date</td>
          <td>Name</td>
          <td width="550">Description</td>
          <td width="100" align="center">Action</td>
        </tr>
        <tr v-bind:key="task._id" v-for="task in tasks">
          <td align="center">
            <input type="checkbox" id="checkbox" v-model="task.done" @change="check(task, $event)">
          </td>
          <td v-bind:class="{ complete: task.done }">{{ task.date | moment }}</td>
          <td v-bind:class="{ complete: task.done }">{{ task.name }}</td>
          <td v-bind:class="{ complete: task.done, description: true }">{{ task.description }}</td>
          <td align="center">
            <router-link v-bind:to="{ name: 'EditTask', params: { id: task._id } }">Edit</router-link> |
            <a href="#" @click="deleteTask(task._id)">Delete</a>
          </td>
        </tr>
      </table>
    </div>
    <div v-else>
      There are no tasks... Lets add one now <br /><br />
      <router-link v-bind:to="{ name: 'NewTask' }" class="add_task_link">Add Task</router-link>
    </div>
    <div class="new-button">
      <router-link v-bind:to="{ name: 'NewTask' }">Add Task</router-link>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import TasksService from '@/services/TasksService'

export default {
  name: 'tasks',
  data () {
    return {
      tasks: []
    }
  },
  filters: {
    moment: function (date) {
      return moment(date).format('MMMM Do YYYY')
    }
  },
  mounted () {
    this.getTasks()
  },
  methods: {
    async getTasks () {
      const response = await TasksService.fetchTasks()
      this.tasks = response.data.tasks
    },
    async deleteTask (id) {
      await TasksService.deleteTask(id)
      this.getTasks()
      this.$router.push({ name: 'Tasks' })
    },
    async check (task, event) {
      await TasksService.updateTask({
        id: task._id,
        name: task.name,
        done: event.target.checked
      })
      this.$router.push({ name: 'Tasks' })
    }
  }
}
</script>

<style type="text/css">
.table-wrap {
  width: 60%;
  margin: 0 auto;
  text-align: center;
}
table th, table tr {
  text-align: left;
}
table thead {
  background: #f2f2f2;
}
table tr td {
  padding: 10px;
}
table tr:nth-child(odd) {
  background: #f2f2f2;
}
table tr:nth-child(1) {
  background: #4d7ef7;
  color: #fff;
}
a {
  color: #4d7ef7;
  text-decoration: none;
}
a.add_task_link {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
}
.complete {
  text-decoration: line-through;
}

.description {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.new-button {
  margin-top: 10px;
  font-size: 18px;
}
</style>
