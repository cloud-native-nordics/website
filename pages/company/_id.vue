<template>
  <v-container fluid v-if="company">
    <v-row>
      <v-col fill-height class="pt-5 pb-5">
        <v-img max-height="400" v-bind:class="{ darkLogo: company.whiteLogo }" v-if="company.logoURL" :src="company.logoURL" class="white--text align-end" contain></v-img>
        <headline v-else :text="company.name"></headline>
      </v-col>
    </v-row>
    <speakers :speakers="company.speakers"></speakers>
    <sponsorings :sponsorings="company.sponsorTiers"></sponsorings>
  </v-container>
</template>

<script>
import company from "~/graphql/company.gql";
import sponsorings from "~/components/company/sponsorings";
import speakers from "~/components/company/speakers";
import headline from "~/components/common/Headline";

export default {
  components: {
    sponsorings: sponsorings,
    headline: headline,
    speakers: speakers,
  },
  apollo: {
    company: {
      query: company,
      variables() {
        return { id: this.$route.params.id };
      }
    }
  }
};
</script>