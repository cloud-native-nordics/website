<template>
  <section>
    <v-container v-if="membersByCountry" grid-list-lg fluid>
      <v-layout row fill-height class="pt-5 pb-5 d-flex flex-wrap flex-md-nowrap">
        <headline text="members"></headline>
        <country-filter :selectedCountry="selectedCountry" @selectCountry="setSelectedCountry"></country-filter>
      </v-layout>
      <v-layout wrap>
        <v-flex v-for="member in membersByCountry" :key="member.id" lg2 xs6>
          <v-card text>
            <v-card-title>
              <v-img contain :src="member.logoURL" height="200px"></v-img>
            </v-card-title>
            <v-card-text>
              <span class="text--primary .text-no-wrap">
                <router-link
                  v-if="member.name"
                  :to="'/company/'+member.name"
                  target="_blank"
                >{{member.name}}</router-link>
              </span>
              <br />
              <span class="text--primary">
                <a :href="member.websiteURL">Website</a>
              </span>
            </v-card-text>
            <v-footer absolute>
              <router-link
                :key="country.name"
                v-for="country in member.countries"
                :to="'/meetup-groups?country='+country.name"
              >{{country.name}}</router-link>
            </v-footer>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </section>
</template>

<script>
import members from "~/graphql/members.gql";
import CountryFilter from "~/components/common/CountryFilter.vue";
import Headline from "~/components/common/Headline.vue";
export default {
  components: {
    CountryFilter: CountryFilter,
    Headline: Headline
  },
  apollo: {
    members: {
      query: members
    }
  },
  data() {
    return {
      selectedCountry: "all countries",
      searchText: ""
    };
  },
  computed: {
    membersByCountry() {
      if (this.members != undefined) {
        return this.members
          .filter(x => {
            let valid = true;
            x.countries.forEach(country => {
              valid =
                this.selectedCountry === country.name ||
                this.selectedCountry === "all countries";
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
