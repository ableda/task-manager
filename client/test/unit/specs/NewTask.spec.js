import flushPromises from "flush-promises"
import { mount, shallowMount, createLocalVue } from '@vue/test-utils'

import Vue from 'vue';
import VueRouter from "vue-router"

import NewTask from '@/components/NewTask'
import router from "@/router/index.js"

const localVue = createLocalVue()
localVue.use(VueRouter)

describe('Tasks Rendering', () => {

  // Set correct default data
  it('sets the correct default data', () => {
    expect(typeof NewTask.data).toBe('function')
    const defaultData = NewTask.data()
    expect(defaultData.name).toEqual('')
    expect(defaultData.description).toEqual('')
    expect(defaultData.date).toEqual('')
  })

  it('should render correct contents', () => {
	const wrapper = shallowMount(NewTask, {
	  stubs: ['router-link'],
	  localVue, router
	})

	// Test that we render all divs, buttons correctly
	expect(wrapper.find("h1").text()).toBe('Add Task')
    expect(wrapper.find("input").attributes().placeholder).toBe('NAME')
    expect(wrapper.find("textarea").attributes().placeholder).toBe('DESCRIPTION')

    expect(wrapper.find("button").text()).toBe('Add')
    expect(wrapper.find("button").classes()).toContain('app_task_btn')
  })

  it('Correctly calls method to add task', async () => {
    const wrapper = shallowMount(NewTask, {
      stubs: ['router-link'],
      localVue, router,
      methods: {
        async addTask () {
          return new Promise((resolve) => {
            resolve()
          })
        },
      }
    })

    var nameInput = wrapper.find("input")
    nameInput.setValue('New Task Test')

    var description = wrapper.find("textarea")
    description.setValue('New Task Description')

    // Simulate Delete button click
    wrapper.findAll("button").trigger("click")

    await flushPromises()

    expect(wrapper.vm.name).toBe('New Task Test')
    expect(wrapper.vm.description).toBe('New Task Description')

    // TODO: testing datepicker input
  })

})
