<template>
  <v-container fluid v-if="meetupGroup">
    <v-row>
      <v-col fill-height class="pt-5 pb-5">
        <headline :text="meetupGroup.name"></headline>
      </v-col>
    </v-row>
    <organizers :organizers="meetupGroup.organizers"></organizers>
    <description :description="meetupGroup.description"></description>
    <meetups :meetups="meetupGroup.meetups" :meetupGroupId="$route.params.id"></meetups>
    <sponsors :sponsors="meetupGroup.sponsorTiers"></sponsors>
  </v-container>
</template>

<script>
import headline from "~/components/common/Headline";
import organizers from "~/components/meetup-groups/organizers";
import meetups from "~/components/meetup-groups/meetups";
import sponsors from "~/components/meetup-groups/sponsors";
import description from "~/components/meetup-groups/description";
import meetupGroup from "~/graphql/meetupGroup.gql";
export default {
  components: {
    headline: headline,
    organizers: organizers,
    meetups: meetups,
    description: description,
    sponsors: sponsors
  },
  apollo: {
    meetupGroup: {
      query: meetupGroup,
      variables() {
        return { meetupID: this.$route.params.id };
      }
    }
  }
};
</script>