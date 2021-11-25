<template>
  <div>
    <h1>Events Listing</h1>
    <EventCard v-for="event in events" :key="event.id" :event="event" />
    <template v-if="page !== 1">
      <router-link
        :to="{ name: 'event-list', query: { page: page - 1 } }"
        rel="prev"
        >Prev Page
      </router-link>
      <template v-if="nextPage"> | </template>
    </template>
    <template v-if="nextPage">
      <router-link
        :to="{ name: 'event-list', query: { page: page + 1 } }"
        rel="next"
        >Next Page
      </router-link>
    </template>
  </div>
</template>

<script>
import EventCard from '@/components/EventCard.vue'
import { mapState } from 'vuex'

export default {
  components: {
    EventCard,
  },
  computed: {
    nextPage() {
      return this.eventsTotal > this.page * this.perPage
    },
    page() {
      return parseInt(this.$route.query.page) || 1
    },
    ...mapState(['events', 'eventsTotal']),
  },
  created() {
    this.perPage = 3
    this.$store.dispatch('fetchEvents', {
      perPage: this.perPage,
      page: this.page,
    })
  },
}
</script>
