<template>
  <v-flex xs6 class="d-flex justify-end pr-5">
    <div class="d-none d-md-flex">
      <template v-for="(country, index) in countries">
        <v-btn
          v-if="index==0"
          outlined
          rounded
          :selected="country === selectedCountry"
          class="country-btn country-btn--all text-capitalize mr-2 mt-1"
          v-bind:key="country"
          @click="setSelectedCountry(country)"
        >{{country}}</v-btn>
        <v-btn
          v-else
          outlined
          rounded
          :selected="country === selectedCountry"
          class="country-btn text-capitalize mr-2 mt-1"
          v-bind:key="country"
          @click="setSelectedCountry(country)"
        >{{country}}</v-btn>
      </template>
    </div>
    <div class="d-flex d-md-none">
      <v-menu offset-y transition="scroll-y-transition">
        <template v-slot:activator="{ on }">
          <v-btn outlined rounded class="country-btn text-capitalize" v-on="on">Filter</v-btn>
        </template>
        <v-list text>
          <template v-for="country in countries">
            <v-list-item v-bind:key="country">
              <v-btn
                outlined
                block
                :selected="country === selectedCountry"
                class="country-btn-sm text-capitalize"
                @click="setSelectedCountry(country)"
              >{{country}}</v-btn>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
    </div>
  </v-flex>
</template>
<script>
export default {
  props: ["selectedCountry"],
  data() {
    return {
      countries: ["all countries", "denmark", "sweden", "norway", "finland", "iceland"],
      searchText: ""
    };
  },
  methods: {
    setSelectedCountry(country) {
      this.$emit("selectCountry", country);
    }
  },
  mounted() {
    // see if there's searchText query parameter in the url and if there is, choose the country
    if (this.$route.query.country !== undefined) {
      if (this.countries.includes(this.$route.query.country)) {
        this.$emit("selectCountry", this.$route.query.country);
      }
      let query = Object.assign({}, this.$route.query);
      delete query.country;
      this.$router.replace({ query });
    }
  }
};
</script>
