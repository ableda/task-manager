import { shallowMount, mount, createLocalVue } from "@vue/test-utils"
import App from "@/App.vue"
import VueRouter from "vue-router"

// Components to test rendering via routing
import Tasks from '@/views/Tasks'
import NewTask from '@/components/NewTask'
import EditTask from '@/components/EditTask'

import router from "@/router/index.js"

const localVue = createLocalVue()
localVue.use(VueRouter)

describe("App", () => {
  it("renders the child components via routing", () => {
    const wrapper = mount(App, { localVue, router })

    router.push("/")

    expect(wrapper.find(Tasks).exists()).toBe(true)

    router.push("/tasks/new")

    expect(wrapper.find(NewTask).exists()).toBe(true)
  })
})