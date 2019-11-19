<template>
  <div>
    <v-row>
      <v-col>
        <h3>Meetups</h3>
      </v-col>
    </v-row>
    <v-row class="pl-5 pr-5">
      <v-col cols="12">
        <v-card>
          <v-carousel cycle hide-delimiters>
            <v-carousel-item v-for="meetup in sortedMeetups" v-bind:key="meetup.id" nuxt :to="`/events/${meetup.id}`">
              <v-sheet height="90%" tile>
                <v-row class="fill-height" align="center" justify="center">
                  <v-img height="400px" v-if="meetup.photo" contain :src="meetup.photo"></v-img>
                  <span v-else class="white--text">Image not available</span>
                </v-row>
              </v-sheet>
              <v-sheet height="10%" light tile>
                <v-row justify="center" align="center">
                  <v-col
                    justify="center"
                    align="center"
                    class="pt-1"
                    cols="auto"
                  >{{new Date(meetup.date).toLocaleString()}}</v-col>
                  <!-- <v-col justify="center" align="center" class="pt-2 pl-1" cols="auto">
                    <a
                      :href="`https://meetup.com/${meetupGroupId}/events/${meetup.id}`"
                      target="_blank"
                    >
                      <img class="meetup-logo" contain src="/meetup.png" height="33px" />
                    </a>
                  </v-col> -->
                </v-row>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["meetups", "meetupGroupId"],
  computed: {
    sortedMeetups() {
      return this.meetups.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
    }
  }
};
</script>

<style>
.meetup-logo {
  filter: invert(52%) sepia(99%) saturate(5096%) hue-rotate(212deg)
    brightness(93%) contrast(92%);
}
</style>