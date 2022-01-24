import EventService from '@/services/EventService'

export const namespaced = true

export const state = {
  events: [],
  event: {},
  eventsTotal: 0,
  perPage: 3,
}

export const mutations = {
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
}

export const getters = {
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
}
export const actions = {
  fetchEvents({ commit, dispatch, state }, { page }) {
    return EventService.getEvents(state.perPage, page)
      .then((response) => {
        commit('SET_EVENTS_TOTAL', parseInt(response.headers['x-total-count']))
        commit('SET_EVENTS', response.data)
      })
      .catch((error) => {
        const notification = {
          type: 'error',
          message: `There was Beans fetching events: ${error.message}`,
        }
        dispatch('notification/add', notification, { root: true })
      })
  },
  fetchEvent({ commit, getters }, id) {
    let event = getters.getEventById(id)

    if (event) {
      commit('SET_EVENT', event)
      return event
    } else {
      return EventService.getEvent(id).then((response) => {
        commit('SET_EVENT', response.data)
        return response.data
      })
    }
  },
  createEvent({ commit, dispatch }, event) {
    return EventService.postEvent(event)
      .then(() => {
        commit('ADD_EVENT', event)
        const notification = {
          type: 'success',
          message: 'Event was created successfully',
        }
        dispatch('notification/add', notification, { root: true })
      })
      .catch((error) => {
        const notification = {
          type: 'error',
          message: `There was Beans creating the event: ${error.message}`,
        }
        dispatch('notification/add', notification, { root: true })
        throw error
      })
  },
}
