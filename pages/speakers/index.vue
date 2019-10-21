<template>
  <section>
    <v-container grid-list-lg fluid>
      <v-layout row fill-height class="pt-5 pb-5 d-flex flex-wrap flex-md-nowrap">
        <v-flex xs4 class="pt-0">
          <h1>SPEAKERS</h1>
        </v-flex>
        <v-flex xs8 class="d-flex justify-end">
          <div class="d-none d-lg-flex">
            <template v-for="(country, index) in countries">
              <v-btn v-if="index==0" outlined rounded :selected="country === selectedCountry" class="country-btn country-btn--all text-capitalize mr-2 mt-1" v-bind:key="country" @click="setSelectedCountry(country)">{{country}}</v-btn>
              <v-btn v-else outlined rounded :selected="country === selectedCountry" class="country-btn text-capitalize mr-2 mt-1" v-bind:key="country" @click="setSelectedCountry(country)">{{country}}</v-btn>
            </template>
          </div>
          <div class="d-flex d-lg-none">
            <v-menu offset-y transition="scroll-y-transition">
              <template v-slot:activator="{ on }">
                <v-btn outlined rounded class="country-btn text-capitalize mt-1" v-on="on">Filter</v-btn>
              </template>
            </v-menu>
            </div>
            <div class="d-flex d-sm-none">
              <v-menu offset-y transition="scroll-y-transition">
                <template v-slot:activator="{ on }">
                  <v-btn outlined rounded class="country-btn text-capitalize" v-on="on">Filter</v-btn>
                </template>
                <v-list text>
                  <template v-for="country in countries">
                    <v-list-item v-bind:key="country">
                      <v-btn outlined block class="country-btn country-btn text-capitalize" @click="setSelectedCountry(country)">{{country}}</v-btn>
                    </v-list-item>
                  </template>
                </v-list>
              </v-menu>
            </div>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex v-for="speaker in speakersByCountry" :key="speaker.id" lg2 xs6>
            <v-card text>
              <v-card-title>
                <router-link :to="'/speakers/'+speaker.id">{{speaker.name}}</router-link>
              </v-card-title>
              <v-card-text>
                <span v-if="speaker.title" class="text--primary .text-no-wrap text-title">
                  {{ speaker.title}}
                  <br />
                </span>
                <span class="text--primary .text-no-wrap">
                  @
                  <router-link
                  v-if="speaker.company"
                  :to="'/company/'+speaker.company.id"
                  target="_blank"
                  >{{speaker.company.name}}</router-link>
                </span>
              </v-card-text>
              <v-card-actions>
                <v-layout justify-start row fill-height>
                  <v-flex xs12>
                    <a
                    :href="speaker.github ? 'https://github.com/'+ speaker.github : 'https://github.com/'"
                    target="_blank"
                    >
                    <img contain src="github.png" height="33px" />
                  </a>
                  <a
                  :href="speaker.speakersBureau ? 'https://www.cncf.io/speaker/'+speaker.speakersBureau : 'https://www.cncf.io/speakers/'"
                  target="_blank"
                  >
                  <img contain src="cncf.png" height="33px" />
                </a>
              </v-flex>
            </v-layout>
          </v-card-actions>
          <v-footer absolute>
            <router-link
            :key="country.name"
            v-for="country in speaker.countries"
            :to="'/meetup-groups?country='+country.name"
            >{{country.name}}</router-link>
          </v-footer>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <Footer></Footer>
  </section>
</template>

<script>
  import speakers from "~/graphql/speakers.gql";
  import Footer from '~/components/Footer.vue';
  export default {
    components:{
     'Footer':Footer,
   },
   apollo: {
    speakers: {
      query: speakers
    }
  },
  data() {
    return {
      countries: ["all countries","denmark", "sweden", "norway", "finland"],
      selectedCountry: "all countries",
      searchText: ""
    };
  },
  computed: {
    speakersByCountry() {
      if (this.speakers != undefined) {
        return this.speakers
        .filter(x => {
          let valid = true;
          x.countries.forEach(country => {
            valid = this.selectedCountry === country.name || this.selectedCountry === "all countries";
          });
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
    }
  }
};
</script>

<style scoped>
.nowrap {
  white-space: nowrap;
}
</style>
