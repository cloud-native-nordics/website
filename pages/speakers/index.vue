<template>
    <v-container grid-list-lg fluid>
      <v-layout row fill-height class="pt-5 pb-5 d-flex flex-wrap flex-md-nowrap">
        <headline text="speakers"></headline>
        <country-filter :selectedCountry="selectedCountry" @selectCountry="setSelectedCountry"></country-filter>
      </v-layout>
      <v-layout wrap class="pl-5 pr-5">
        <v-flex v-for="speaker in speakersByCountry" :key="speaker.id" lg2 sm6 md4 xs12>
          <v-card text>
            <v-card-title>
              <v-img contain :src="githubAvatar(speaker.github)" height="200px"></v-img>
            </v-card-title>
            <v-card-text>
              <router-link :to="'/speakers/'+speaker.id">{{speaker.name}}</router-link>
              <br/>
              <router-link
                  v-if="speaker.company"
                  :to="'/company/'+speaker.company.id"
                  target="_blank"
                >{{speaker.company.name}}</router-link>
                <br/>
              <span v-if="speaker.title" class="text--primary .text-wrap text-title">
                {{ speaker.title}}
              </span>
              <span v-else class="text--primary .text-no-wrap text-title">
                -
              </span>
            </v-card-text>
            <v-footer class="card-footer" absolute>
              <router-link
                :key="country"
                v-for="country in speaker.countries"
                :to="'/meetup-groups?country='+country"
              >{{country+"&nbsp"}}</router-link>
            </v-footer>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
import speakers from "~/graphql/speakers.gql";
import CountryFilter from "~/components/common/CountryFilter.vue";
import Headline from "~/components/common/Headline.vue";
export default {
  components: {
    CountryFilter: CountryFilter,
    Headline: Headline
  },
  apollo: {
    speakers: {
      query: speakers
    }
  },
  data() {
    return {
      selectedCountry: "all countries",
      searchText: ""
    };
  },
  computed: {
    speakersByCountry() {
      if (this.speakers != undefined) {
        return this.speakers
          .filter(x => {
            let valid = false;
            x.countries.forEach(country => {
              if (!valid) {
                valid =
                  this.selectedCountry === country ||
                  this.selectedCountry === "all countries";
              }
            });
            return valid;
          })
          .filter(x => {
            let valid = true;
            if (x.countries.length == 0) {
              valid = false;
            }
            return valid;
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
    },
    githubAvatar(githubId){
      if (githubId == "") {
        return "no-image.png"
      }
      return "https://github.com/"+githubId+".png?size=200"
    }
  }
};
</script>

<style scoped>
.nowrap {
  white-space: nowrap;
}
</style>
