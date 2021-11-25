import Vue from 'vue'
import Vuex from 'vuex'
import EventService from '@/services/EventService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: { id: 'abc123', name: 'Adam Jahr' },
    categories: [
      'sustainability',
      'nature',
      'animal welfare',
      'housing',
      'education',
      'food',
      'community',
    ],
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false },
      { id: 3, text: '...', done: true },
      { id: 4, text: '...', done: false },
    ],
    events: [],
    event: {},
    eventsTotal: 0,
  },
  mutations: {
    SET_EVENT(state, event) {
      state.event = event
    },
    SET_EVENTS(state, events) {
      state.events = events
    },
    ADD_EVENT(state, event) {
      state.events.push(event)
    },
    SET_EVENTS_TOTAL(state, eventsTotal) {
      state.eventsTotal = eventsTotal
    },
  },
  getters: {
    eventsLength: (state) => {
      return state.events.length
    },
    categoriesLength: (state) => {
      return state.categories.length
    },
    doneTodos: (state) => {
      return state.todos.filter((todo) => todo.done)
    },
    activeTodosCount: (state) => {
      return state.todos.filter((todo) => !todo.done).length
    },
    getEventById: (state) => (id) => {
      return state.events.find((event) => event.id === id)
    },
  },
  actions: {
    fetchEvent({ commit, getters }, id) {
      let event = getters.getEventById(id)
      if (event) {
        commit('SET_EVENT', event)
      } else {
        EventService.getEvent(id)
          .then((response) => {
            commit('SET_EVENT', response.data)
          })
          .catch((err) => {
            console.log('You cooked beans!!!:', err.response)
          })
      }
    },
    fetchEvents({ commit }, { perPage, page }) {
      EventService.getEvents(perPage, page)
        .then((response) => {
          commit(
            'SET_EVENTS_TOTAL',
            parseInt(response.headers['x-total-count'])
          )
          commit('SET_EVENTS', response.data)
        })
        .catch((error) => {
          console.log('There was an error:', error.response)
        })
    },
    createEvent({ commit }, event) {
      return EventService.postEvent(event).then(() => {
        commit('ADD_EVENT', event)
      })
    },
  },
  modules: {},
})
