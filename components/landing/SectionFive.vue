<template>
  <v-container fluid class="section-five">
    <v-row>
      <v-col cols="2"></v-col>
      <v-col cols="4" justify="center" align="center">
        <v-img width="45%" src="/mascot.png" />
      </v-col>
      <v-col cols="4" justify="center" align="center">
        <h2 style="color: white;">Upcoming events</h2>
        <br/>
        <div v-for="meetup in nextMeetups" :key="meetup.id">
        <h3>{{meetup.name}}</h3>
        <p class="date">{{formattedDate(meetup.date)}}</p>
        </div>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
  </v-container>
</template>


<script>
import moment from 'moment'
import meetups from "~/graphql/events.gql";
import Headline from "~/components/common/Headline.vue";
export default {
  components: {
    Headline: Headline
  },
  apollo: {
    meetups: {
      query: meetups
    }
  },
  computed: {
    nextMeetups() {
        return this.meetups.sort( ( a, b) => {
            return new Date(b.date) - new Date(a.date);
        }).slice(0, 5);
    }
  },
  methods: {
    formattedDate: function(date) {
      return moment(date).format('YYYY-MM-DD');
    }
  }
};
</script>