<template>
  <section>
    <v-container grid-list-lg fluid>
      <v-layout row fill-height class="pt-5 pb-5 d-flex flex-wrap flex-md-nowrap">
        <headline text="groups"></headline>
        <country-filter :selectedCountry="selectedCountry" @selectCountry="setSelectedCountry"></country-filter>
      </v-layout>
      <v-layout wrap align-center>
        <v-flex v-for="meetupGroup in meetupGroupsByCountry" :key="meetupGroup.meetupID" xs12 lg4>
          <v-card text>
            <v-card-title>
              <v-img
                position="center"
                contain
                :src="meetupGroup.city.toLowerCase()+'.jpeg'"
                height="250px"
              ></v-img>
            </v-card-title>
            <v-card-text class="text-center font-weight-bold title">
              <router-link
                :key="meetupGroup.name"
                :to="'/meetup-groups/'+meetupGroup.meetupID"
              >{{meetupGroup.name}}</router-link>
            </v-card-text>
            <v-card-actions>
              <v-layout row fill-height>
                <v-flex class="d-flex justify-center" xs12>
                  <a
                    class="mr-2"
                    :href="meetupGroup.city ? 'https://github.com/cloud-native-nordics/meetups/tree/master/'+ meetupGroup.city.toLowerCase() : 'https://github.com/cloud-native-nordics/meetups/tree/master/'"
                    target="_blank"
                  >
                    <img contain src="github.png" height="33px" />
                  </a>

                  <a
                    class="ml-2"
                    :href="meetupGroup.meetupID ? 'https://www.meetup.com/'+meetupGroup.meetupID : 'https://www.meetup.com/'"
                    target="_blank"
                  >
                    <img contain src="meetup.png" height="33px" />
                  </a>
                </v-flex>
              </v-layout>
            </v-card-actions>
            <br />
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </section>
</template>

<script>
import meetupGroups from "~/graphql/meetupGroups.gql";
import CountryFilter from "~/components/CountryFilter.vue";
import Headline from "~/components/Headline.vue";
export default {
  components: {
    CountryFilter: CountryFilter,
    Headline: Headline
  },
  apollo: {
    meetupGroups: {
      query: meetupGroups
    }
  },
  data() {
    return {
      selectedCountry: "all countries",
      searchText: ""
    };
  },
  computed: {
    meetupGroupsByCountry() {
      if (this.meetupGroups != undefined) {
        return this.meetupGroups
          .filter(x => {
            return (
              this.selectedCountry === x.country ||
              this.selectedCountry === "all countries"
            );
          })
          .filter(x => {
            if (
              this.searchText === "" ||
              x.name.toLowerCase().includes(this.searchText.toLowerCase())
            ) {
              return true;
            }
            return false;
          });
      }
    }
  },
  methods: {
    setSelectedCountry(country) {
      this.selectedCountry = country;
    }
  }
};
</script>

<style scoped>
.nowrap {
  white-space: nowrap;
}
</style>
