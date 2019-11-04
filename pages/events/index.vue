<template>
  <section>
    <v-container grid-list-lg fluid>
      <v-layout row fill-height class="pt-5 pb-5 d-flex flex-wrap flex-md-nowrap">
        <headline text="events"></headline>
      </v-layout>
      <v-layout wrap align-center>
        <v-flex v-for="event in sortedMeetups" :key="event.id" xs12 lg4>
          <v-card text>
            <v-card-title>
              <v-img
                position="center"
                contain
                :src="event.photo"
                height="250px"
              ></v-img>
            </v-card-title>
            <v-card-text class="text-center font-weight-bold title">
              {{ event.name }}
            </v-card-text>
            <v-card-actions>
              <v-layout row fill-height>
                <v-flex class="d-flex justify-center" xs12>
                {{ event.date }}
                </v-flex>
              </v-layout>
            </v-card-actions>
            <br />
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </section>
</template>

<script>
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
    sortedMeetups() {
        if (this.meetups) {
          return this.meetups.sort( ( a, b) => {
              return new Date(b.date) - new Date(a.date);
          });
        } else {
          return [];
        }
    }
  }
};
</script>

<style scoped>
.nowrap {
  white-space: nowrap;
}
</style>
