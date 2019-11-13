<template>
  <div>
    <v-row>
      <v-col>
        <h3>Organizers</h3>
      </v-col>
    </v-row>
    <v-row class="pl-5 pr-5">
      <v-col
        v-for="organizer in organizers"
        v-bind:key="organizer.id"
        lg="2"
        sm="4"
        md="4"
        cols="6"
      >
        <v-card>
          <v-img
            :src="githubAvatar(organizer.github)"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="200px"
          >
            <v-card-title><router-link class="white--text" :to="'/speakers/'+organizer.id">{{organizer.name}}</router-link></v-card-title>
          </v-img>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="organizer.email" icon :href="'mailto:'+organizer.email" target="_blank">
              <v-icon>mdi-email</v-icon>
            </v-btn>
            <v-btn icon :href="organizer.company.websiteURL" target="_blank">
              <v-icon v-if="organizer.company.websiteURL">mdi-domain</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["organizers"],
  methods: {
    githubAvatar(githubId) {
      if (githubId == "") {
        return "/no-image.png";
      }
      return "https://github.com/" + githubId + ".png?size=200";
    }
  }
};
</script>

<style>
</style>