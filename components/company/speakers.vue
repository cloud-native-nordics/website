<template>
  <div>
    <v-row>
      <v-col>
        <h3>Speakers</h3>
      </v-col>
    </v-row>
    <v-row class="pl-5 pr-5">
      <v-col v-for="speaker in speakers" v-bind:key="speaker.id" lg="2" sm="4" md="4" cols="6">
        <v-card>
          <v-img
            :src="githubAvatar(speaker.github)"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="200px"
          >
            <v-card-title>
              <span class="text--primary .text-no-wrap">
                <router-link
                  class="white--text"
                  v-if="speaker.name"
                  :to="'/speakers/'+speaker.id"
                >{{speaker.name}}</router-link>
              </span>
            </v-card-title>
          </v-img>

          <v-card-actions v-if="speaker.email">
            <v-spacer></v-spacer>
            <v-btn icon :href="'mailto:'+speaker.email" target="_blank">
              <v-icon>mdi-email</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["speakers"],
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