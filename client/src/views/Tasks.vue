<template>
  <div class='tasks'>
    <h1>Tasks</h1>

    <div class="selector-container">
      <button v-bind:key="btn"  v-for="btn in filterBtns" class="task-select" :class="{selected: activeFilter == btn}" v-on:click="filter($event)" @click="activeFilter=btn">{{ btn }}</button>
    </div>

    <div v-if="tasks.length > 0" class="table-wrap">
      <div class="new-button">
        <router-link v-bind:to="{ name: 'NewTask' }">Add Task</router-link>
      </div>
      <table>
        <tr>
          <td>Done</td>
          <td width="200">Due Date</td>
          <td>Name</td>
          <td width="550">Description</td>
          <td width="100" align="center">Action</td>
        </tr>
        <tr v-bind:key="task._id" v-for="task in tasks">
          <td align="center" v-bind:class="rowClass(task)">
            <input type="checkbox" id="checkbox" v-model="task.done" @change="checkTask(task, $event)">
          </td>
          <td v-bind:class="rowClass(task)">{{ task.date | moment }}</td>
          <td v-bind:class="rowClass(task)">{{ task.name }}</td>
          <td class="description" v-bind:class="rowClass(task)">{{ task.description }}</td>
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
  </div>
</template>

<script>
import moment from 'moment'
import TasksService from '@/services/TasksService'

export default {
  name: 'tasks',
  data () {
    return {
      tasks: [],
      activeFilter: 'All',
      filterBtns: ['Today', 'Tomorrow', 'Today/Tomorrow', 'Overdue', 'Completed', 'All']
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
    rowClass (task) {
      var today = moment().local().startOf('day')
      var tomorrow = moment().local().add(1, 'days').endOf('day')

      return {
        'complete': task.done,
        'overdue': moment(task.date).isBefore(today) && task.done === false,
        'complete-soon': moment(task.date).isBetween(today, tomorrow)
      }
    },
    // Different API calls to get list of tasks
    async getTasks () {
      const response = await TasksService.fetchAllTasks()
      this.tasks = response.data.tasks
    },
    async deleteTask (id) {
      await TasksService.deleteTask(id)
      this.getTasks()
      this.$router.push({ name: 'Tasks' })
    },
    async checkTask (task, event) {
      await TasksService.updateTask({
        id: task._id,
        name: task.name,
        done: event.target.checked
      })
      this.$router.push({ name: 'Tasks' })
    },
    async filter (event) {
      var filterParams = {}

      switch (event.target.innerText) {
        case 'TODAY':
          filterParams = {date: new Date()}
          break
        case 'TOMORROW':
          filterParams = {date: moment(new Date()).add(1, 'days').toDate()}
          break
        case 'TODAY/TOMORROW':
          filterParams = {startDate: new Date(), endDate: moment(new Date()).add(1, 'days').toDate()}
          break
        case 'OVERDUE':
          filterParams = {overdue: true}
          break
        case 'COMPLETED':
          filterParams = {done: true}
          break
        default:
          this.getTasks()
          this.$router.push({ name: 'Tasks' })
          return
      }
      const response = await TasksService.fetchFilterTasks(filterParams)
      if (response.data.status) {
        this.tasks = response.data.tasks
        this.$router.push({ name: 'Tasks' })
      }
    }
  }
}
</script>

<style type="text/css">

.selector-container {
   margin-bottom: 20px;
}

.task-select {
    padding: 10px 45px;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: bold;
    border: 0;
    outline: 0 none;
}
.task-select.selected {
    border-bottom: solid 2px #4d7ef7;
}

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
  max-width: 550px;
}

.overdue {
  background: rgb(255,0,0, 0.2)
}
.complete-soon {
  background: rgb(255,255,153, 0.5)
}

.new-button {
  margin-top: 10px;
  font-size: 18px;
}
</style>
