<template>
  <div>
    <v-row class="pl-5 pr-5">
      <v-col cols="12">
        <v-card>
          <v-img
            :src="githubAvatar(speaker.github)"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          ></v-img>

          <v-card-text>
            <v-row dense class="mx-auto">
              <v-col cols="12">
                <b>Company:</b>
                <span class="text--primary .text-no-wrap">
                  <router-link
                    v-if="speaker.company.name"
                    :to="'/company/'+speaker.company.id"
                  >{{speaker.company.name}}</router-link>
                </span>
              </v-col>
              <v-col cols="12">
                <b>Title:</b>
                <span class="text--primary .text-no-wrap">{{speaker.title}}</span>
              </v-col>
              <v-col cols="12">
                <b>Presentations:</b>
                <span class="text--primary .text-no-wrap">{{filteredPresentations.length}}</span>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions v-if="speaker.email">
            <v-spacer></v-spacer>
            <v-btn icon :href="'mailto:'+speaker.email" target="_blank">
              <v-icon>mdi-email</v-icon>
            </v-btn>
            <v-btn
              icon
              v-if="speaker.company.websiteURL"
              :href="speaker.company.websiteURL"
              target="_blank"
            >
              <v-icon v-if="speaker.company.websiteURL">mdi-domain</v-icon>
            </v-btn>
            <a class="mt-1 pl-3 mr-3" :href="'https://github.com/'+speaker.github" target="_blank">
              <img class="github-logo" contain src="/github.png" height="22px" />
            </a>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["speaker"],
  methods: {
    githubAvatar(githubId) {
      if (githubId == "") {
        return "/no-image.png";
      }
      return "https://github.com/" + githubId + ".png?size=200";
    }
  },
  computed: {
    filteredPresentations() {
      return this.speaker.presentations.filter(presentation => {
        let time = presentation.duration.substring(0, 2);
        let duration = parseInt(time);
        if (duration > 15) {
          return true;
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.github-logo {
  filter: brightness(40%) !important;
}
</style>