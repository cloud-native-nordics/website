<template>
  <v-container fluid class="section-five">
    <v-row>
      <v-col cols="2"></v-col>
      <v-col cols="4" justify="center" align="center" class="d-none d-lg-flex d-xl-flex">
        <v-img contain max-width="300px" src="/mascot.png" />
      </v-col>
      <v-col sm="12" md="12" lg="4" cols="12" justify="center" align="center">
        <h2 style="color: white;">Upcoming events</h2>
        <br/>
        <div v-for="meetup in nextMeetups" :key="meetup.id">
        <h3><a style="color:white" :href="`https://meetup.com/${meetup.meetupGroup.meetupID}/events/${meetup.id}`" target="_blank">{{meetup.name}}</a></h3>
        <p class="date pl-5">{{formattedDate(meetup.date)}}</p>
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
      if(this.meetups){
        return this.meetups.sort( ( a, b) => {
            return new Date(b.date) - new Date(a.date);
        }).filter(x => {
            let valid = false;
            if (!valid) {
              valid = new Date(x.date) >= new Date();
            }
            return valid;
          }).slice(0, 5);
      }else{
        return [];
      }
    }
  },
  methods: {
    formattedDate: function(date) {
      return moment(date).format('YYYY-MM-DD');
    }
  }
};
</script>