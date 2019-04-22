import flushPromises from "flush-promises"
import { mount, shallowMount, createLocalVue } from '@vue/test-utils'

import Vue from 'vue';
import VueRouter from "vue-router"

import Task from '@/views/Tasks';
import EditTask from '@/components/EditTask'
import router from "@/router/index.js"

const localVue = createLocalVue()
localVue.use(VueRouter)

describe('Tasks Rendering', () => {

  // Set correct default data
  it('sets the correct default data', () => {
    expect(typeof Task.data).toBe('function')
    const defaultData = Task.data()
    expect(defaultData.tasks).toEqual([])
	expect(defaultData.activeFilter).toBe('All')
  })

  it('should render correct contents without table', () => {
	const wrapper = shallowMount(Task, {
	  stubs: ['router-link'],
	  localVue, router
	})

	// Test that we render all divs, buttons correctly
	expect(wrapper.find("h1").text()).toBe('Tasks')
	expect(wrapper.findAll(".task-select").length).toBe(6)

	// When no data specified there should be no table
	expect(wrapper.findAll('.table-wrap').length).toBe(0)
  })

  /*
  * Component should render all task data appropiately
  */
  it('should render table with tasks content', () => {
	var moment = require('moment')

	// Start component with task data
	const wrapper = shallowMount(Task, {
	  stubs: ['router-link'],
	  localVue, router,
	  data() {
		return {
		  tasks: [
	  		{ name: 'test task', description: 'test description 1', done: 'false', date: new Date()},
	  		{ name: 'test task 2', description: 'test description 2', done: 'false', date: new Date()}
		  ]
		}
	  }
	})

	// With task data we should see a table, with two of everything
	expect(wrapper.findAll(".table-wrap").length).toBe(1)
	expect(wrapper.findAll("#checkbox").length).toBe(2)

	// Get first task row
	const firstTask = wrapper.findAll('tr').at(1)

	// Checkbox, should have complete class as it is due today, should not be checked\
	const firstCheckBox = firstTask.findAll("td").at(0)
	expect(firstCheckBox.contains("input"))
	expect(firstCheckBox.classes()).toContain('complete')
	expect(firstCheckBox).not.toHaveProperty('checked')

	// Date, Name and Description fields should match data mocked
	expect(firstTask.findAll("td").at(1).text()).toEqual(moment().format('MMMM Do YYYY'))
	expect(firstTask.findAll("td").at(1).classes()).toContain('complete')

	expect(firstTask.findAll("td").at(2).text()).toEqual('test task')
	expect(firstTask.findAll("td").at(2).classes()).toContain('complete')

	expect(firstTask.findAll("td").at(3).text()).toEqual('test description 1')
	expect(firstTask.findAll("td").at(3).classes()).toContain('complete')
	expect(firstTask.findAll("td").at(3).classes()).toContain('description')

	// Last column should contain Edit and Delete buttons
	expect(firstTask.findAll("td").at(4).find('router-link-stub').text()).toEqual('Edit')
	expect(firstTask.findAll("td").at(4).find('a').text()).toEqual('Delete')

  })
})

let url = ''
let data = ''

describe('Tasks User Functionality', () => {
  //
  it('adds `selected` class on an inactive filter button when the user clicks it', () => {
	const wrapper = shallowMount(Task, {
	  stubs: ['router-link'], localVue, router
	})
	const fourthButton = wrapper.findAll('.task-select').at(3)
	fourthButton.trigger('click')

	expect(fourthButton.classes()).toContain('selected')
  })

  /*
  *	Delete button in row properly calls the right method with the right data
  * We need to mock the methods, the service will be tested elsewhere
  */
  it('calls delete method correctly deleting task', async () => {
	const wrapper = shallowMount(Task, {
	  stubs: ['router-link'],
	  localVue, router,
	  data() {
		return {
		  tasks: [
			{ _id: 'f23f023fas', name: 'test task', description: 'test description 1', done: 'false', date: new Date()},
			{ _id: '831hfehcsd', name: 'test task 2', description: 'test description 2', done: 'false', date: new Date()}
		  ]
		}
	  },
	  methods: {
	    async deleteTask (_data) {
		  return new Promise((resolve) => {
      		data = _data
	  		resolve()
		  })
		},
	  }
	})

	// Simulate Delete button click
	wrapper.findAll('tr').at(1).findAll("td").at(4).find('a').trigger("click")

    await flushPromises()

	expect(data).toBe('f23f023fas')
  })

})
