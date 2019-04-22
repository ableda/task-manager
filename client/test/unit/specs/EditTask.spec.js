import flushPromises from "flush-promises"
import { mount, shallowMount, createLocalVue } from '@vue/test-utils'

import Vue from 'vue';
import VueRouter from "vue-router"

import EditTask from '@/components/EditTask'
import router from "@/router/index.js"

const localVue = createLocalVue()
localVue.use(VueRouter)

describe('Tasks Rendering', () => {

  // Set correct default data
  it('sets the correct default data', () => {
    expect(typeof EditTask.data).toBe('function')
    const defaultData = EditTask.data()
    expect(defaultData.name).toEqual('')
    expect(defaultData.description).toEqual('')
    expect(defaultData.date).toEqual('')
  })

  it('should render correct contents', () => {
	const wrapper = shallowMount(EditTask, {
	  stubs: ['router-link'],
	  localVue, router
	})

	// Test that we render all divs, buttons correctly
	expect(wrapper.find("h1").text()).toBe('Edit Task')
    expect(wrapper.find("input").attributes().placeholder).toBe('NAME')
    expect(wrapper.find("textarea").attributes().placeholder).toBe('DESCRIPTION')

    expect(wrapper.find("button").text()).toBe('Update')
    expect(wrapper.find("button").classes()).toContain('app_task_btn')
  })

  it('should render correct task contents', () => {
    const wrapper = shallowMount(EditTask, {
      stubs: ['router-link'],
      localVue, router,
      data() {
        return {
          name: 'Edit name',
          description: 'Edit description'
        }
      },
    })

    expect(wrapper.find("input").element.value).toBe('Edit name')
    expect(wrapper.find("textarea").element.value).toBe('Edit description')

    expect(wrapper.vm.name).toBe('Edit name')
    expect(wrapper.vm.description).toBe('Edit description')

    var nameInput = wrapper.find("input")
    nameInput.setValue('Edit name updated')

    var description = wrapper.find("textarea")
    description.setValue('Edit description updated')

    // Simulate Delete button click
    expect(wrapper.vm.name).toBe('Edit name updated')
    expect(wrapper.vm.description).toBe('Edit description updated')
  })

})
