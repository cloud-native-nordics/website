<template>
  <section>
    <v-container grid-list-lg fluid>
      <v-layout row fill-height class="pt-5 pb-5">
        <v-flex xs7>
          <h1>GROUPS</h1>
        </v-flex>
        <v-flex xs5 class="d-flex justify-end justify-space-between">
          <div class="d-none d-sm-flex">
            <template v-for="(country, index) in countries">
              <v-btn v-if="index==0" outlined rounded :selected="country === selectedCountry" class="country-btn country-btn--all text-capitalize mr-2" v-bind:key="country" @click="setSelectedCountry(country)">{{country}}</v-btn>
              <v-btn v-else outlined rounded :selected="country === selectedCountry" class="country-btn text-capitalize mr-2" v-bind:key="country" @click="setSelectedCountry(country)">{{country}}</v-btn>
            </template>
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
  <Footer></Footer>
  </section>
</template>

<script>
  import meetupGroups from "~/graphql/meetupGroups.gql";
  import Footer from '~/components/Footer.vue';
  export default {
    components:{
     'Footer':Footer,
   },
   apollo: {
    meetupGroups: {
      query: meetupGroups
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
    meetupGroupsByCountry() {
      if (this.meetupGroups != undefined) {
        return this.meetupGroups
        .filter(x => {
          return this.selectedCountry === x.country || this.selectedCountry === "all countries";
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
  mounted() {
    // see if there's searchText query parameter in the url and if there is, choose the country
    if (this.$route.query.country !== undefined) {
      this.selectedCountry = this.$route.query.country;
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
