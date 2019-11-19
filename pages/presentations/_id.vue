<template>
  <v-container fluid v-if="presentation">
    <v-row>
      <v-col fill-height class="pt-5">
        <headline :text="presentation.title"></headline>
      </v-col>
    </v-row>
    <v-row class="pr-5 pl-5">
      <v-col>
        <b>Meetup Group:</b>
        <span class="text--primary .text-no-wrap text-no-decoration">
          <router-link
            class="info-text"
            v-if="presentation.meetup.meetupGroup.name"
            :to="'/meetup-groups/'+presentation.meetup.meetupGroup.meetupID"
          >{{presentation.meetup.meetupGroup.name}}</router-link>
        </span>
      </v-col>
    </v-row>
    <v-row class="pr-5 pl-5">
      <v-col>
        <b>Meetup:</b>
        <span class="text--primary .text-no-wrap text-no-decoration">
          <router-link
            class="info-text"
            v-if="presentation.meetup.name"
            :to="'/events/'+presentation.meetup.id"
          >{{presentation.meetup.name}}</router-link>
        </span>
      </v-col>
    </v-row>
    <v-row class="pr-5 pl-5">
      <v-col>
        <b>Date:</b>
        {{new Date(presentation.meetup.date).toLocaleDateString()}}
      </v-col>
    </v-row>
    <v-row class="pr-5 pl-5">
      <v-col>
        <b>Duration:</b>
        {{presentation.duration}}
      </v-col>
    </v-row>
    <v-row class="pr-5 pl-5" v-if="presentation.slides">
      <v-col>
        <b>Slides:</b>
        <a class="info-text" :href="presentation.slides" target="_blank">Link</a>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import presentation from "~/graphql/presentation.gql";
import headline from "~/components/common/Headline";

export default {
  components: {
    headline: headline
  },
  apollo: {
    presentation: {
      query: presentation,
      variables() {
        return { id: this.$route.params.id };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.info-text {
  font-size: 14px;
  color: #512268;
  text-decoration: none;
}
</style>