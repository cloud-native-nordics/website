<template>
  <section>
    <v-container grid-list-lg fluid>
      <v-layout row fill-height class="pt-5 pb-5 d-flex flex-wrap flex-md-nowrap">
        <headline text="companies"></headline>
        <country-filter :selectedCountry="selectedCountry" @selectCountry="setSelectedCountry"></country-filter>
      </v-layout>
      <v-layout wrap>
        <v-flex v-for="sponsor in companiesByCountry" :key="sponsor.id" lg2 xs6>
          <v-card text>
            <v-card-title>
              <v-img v-bind:class="{ darkLogo: sponsor.whiteLogo }" contain :src="sponsor.logoURL" height="200px"></v-img>
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
                :key="country"
                v-for="country in sponsor.countries"
                :to="'/meetup-groups?country='+country"
              >{{country+"&nbsp"}}</router-link>
            </v-footer>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </section>
</template>

<script>
import companies from "~/graphql/companies.gql";
import CountryFilter from "~/components/common/CountryFilter.vue";
import Headline from "~/components/common/Headline.vue";
export default {
  components: {
    CountryFilter: CountryFilter,
    Headline: Headline
  },
  apollo: {
    companies: {
      query: companies
    }
  },
  data() {
    return {
      selectedCountry: "all countries",
      searchText: ""
    };
  },
  computed: {
    companiesByCountry() {
      if (this.companies != undefined) {
        return this.companies
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
            let valid = true;
            if (x.sponsorTiers.length == 0) {
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
    }
  }
};
</script>

<style scoped>
.nowrap {
  white-space: nowrap;
}
</style>
