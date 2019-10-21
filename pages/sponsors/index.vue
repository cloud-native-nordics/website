<template>
  <section>
    <v-container grid-list-lg fluid>
      <v-layout row fill-height class="pt-5 pb-5 d-flex flex-wrap flex-md-nowrap">
        <v-flex xs4 class="pt-0">
          <h1>SPONSORS</h1>
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
        <v-flex v-for="sponsor in sponsorsByCountry" :key="sponsor.id" lg2 xs6>
          <v-card text>
            <v-card-title>
              <v-img contain :src="sponsor.logoURL" height="200px"></v-img>
            </v-card-title>

            <v-card-text>
              <span class="text--primary .text-no-wrap">
                <router-link
                v-if="sponsor.name"
                :to="'/company/'+sponsor.name"
                target="_blank"
                >{{sponsor.name}}</router-link>
              </span>
              <br />
              <span class="text--primary">
                <a :href="sponsor.websiteURL">Website</a>
              </span>
            </v-card-text>
            <v-footer absolute>
              <router-link
              :key="country.name"
              v-for="country in sponsor.countries"
              :to="'/meetup-groups?country='+country.name"
              >
              {{country.name}}
            </router-link>
          </v-footer>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
  <Footer></Footer>
</section>
</template>

<script>
  import sponsors from "~/graphql/sponsors.gql";
  import Footer from '~/components/Footer.vue';
  export default {
    components:{
     'Footer':Footer,
   },
   apollo: {
    sponsors: {
      query: sponsors
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
    sponsorsByCountry() {
      if (this.sponsors != undefined) {
        return this.sponsors
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
