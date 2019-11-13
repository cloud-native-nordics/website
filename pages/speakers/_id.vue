<template>
  <v-container fluid v-if="speaker">
    <v-row>
      <v-col fill-height class="pt-5">
        <headline :text="speaker.name"></headline>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="4" md="4" lg="4">
        <info :speaker="speaker"></info>
      </v-col>
      <v-col cols="12" sm="8" md="8" lg="8">
        <presentations :presentations="speaker.presentations"></presentations>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import speaker from "~/graphql/speaker.gql";
import headline from "~/components/common/Headline";
import info from "~/components/speakers/info";
import presentations from "~/components/speakers/presentations";

export default {
  components: {
    headline: headline,
    presentations: presentations,
    info: info
  },
  apollo: {
    speaker: {
      query: speaker,
      variables() {
        return { id: this.$route.params.id };
      }
    }
  }
};
</script>