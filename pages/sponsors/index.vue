<template>
  <v-container grid-list-lg fluid>
    <v-layout wrap>
      <v-flex v-for="sponsor in sponsors" :key="id" xs2>
        <v-card light raised v-if="sponsor.venue != null">
          <v-img contain :src="sponsor.venue.logoURL" height="200px"></v-img>
          <v-card-text>
            <span class="black--text">{{sponsor.venue.name}}</span>
            <br />
            <span class="text--primary">
              <span class="grey--text">Venue Sponsor</span>
              <br />
              <a :href="sponsor.venue.websiteURL">Website</a>
            </span>
          </v-card-text>
        </v-card>
        <!-- <v-card light raised v-else-if="sponsor.other">
          <v-img contain :src="sponsor.venue.logoURL" height="200px"></v-img>
          <v-card-text>
            <span class="black--text">{{sponsor.venue.name}}</span>
            <br />
            <span class="text--primary">
              <span class="grey--text">Other Sponsor</span>
              <br />
              <a :href="sponsor.venue.websiteURL">Website</a>
            </span>
          </v-card-text>
        </v-card> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import sponsors from "~/graphql/sponsors.gql";
export default {
  apollo: {
    sponsors: {
      query: sponsors
    }
  }
};
</script>
