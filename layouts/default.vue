<template>
  <v-app dark>
    <div class="app">
      <Slide>
        <v-list class="pa-0 pb-2">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="snowflake.png" />
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>
                <router-link style="text-decoration: none;" to="/">CLOUD NATIVE NORDICS</router-link>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <router-link to="groups">
          <span>
            <v-icon class="pr-4">device_hub</v-icon>Meetup Groups
          </span>
        </router-link>
        <router-link to="speakers">
          <span>
            <v-icon class="pr-4">record_voice_over</v-icon>Speakers
          </span>
        </router-link>
        <router-link to="sponsors">
          <span>
            <v-icon class="pr-4">attach_money</v-icon>Sponsors
          </span>
        </router-link>
        <router-link to="members">
          <span>
            <v-icon class="pr-4">group</v-icon>Members
          </span>
        </router-link>
      </Slide>
      <v-content>
        <nuxt />
      </v-content>
    </div>
  </v-app>
</template>
<script>
import { Slide } from "vue-burger-menu";
export default {
  components: {
    Slide
  },
  data() {
    return {
      drawer: null,
      items: [
        { title: "Home", icon: "dashboard" },
        { title: "About", icon: "question_answer" }
      ],
      right: null
    };
  }
};
</script>
<style>
.bm-burger-bars {
  background-color: #9c27b0 !important;
}
.bm-item-list {
  margin-left: 4% !important;
}
.theme--dark.v-list {
  background: #3f3f41 !important;
}
</style>