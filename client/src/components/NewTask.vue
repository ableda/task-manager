<template>
  <div class="tasks">
    <h1> Add Task </h1>
      <div class="form">
        <div>
          <input type="text" name="name" placeholder="NAME" v-model="name">
        </div>
        <div>
          <textarea rows="15" cols="15" placeholder="DESCRIPTION" v-model="description"></textarea>
        </div>
        <div>
          <datepicker wrapper-class="due-date" placeholder="SELECT DATE" v-model="date"></datepicker>
        </div>
        <div>
          <button class="app_task_btn" @click="addTask">Add</button>
        </div>
        <div>
          <router-link v-bind:to="{ name: 'Tasks' }">Back to Task List</router-link>
        </div>
      </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import TasksService from '@/services/TasksService'

export default {
  components: {
    Datepicker
  },
  name: 'NewTask',
  // Initialize task fields as empty
  // No need for done field since users wouldn't create completed tasks
  data () {
    return {
      name: '',
      description: '',
      date: ''
    }
  },
  methods: {
    async addTask () {
      await TasksService.addTask({
        name: this.name,
        description: this.description,
        date: new Date(this.date)
      })
      this.$router.push({ name: 'Tasks' })
    }
  }
}
</script>

<style type="text/css">
.form input, .form textarea {
  width: 500px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 14px;
}
.form div {
  margin: 20px;
}

.due-date {
  text-align: center;
}

.app_task_btn {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  width: 520px;
  border: none;
  cursor: pointer;
}
</style>
