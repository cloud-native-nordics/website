<template>
  <v-container grid-list-lg fluid>
    <v-combobox
      multiple
      v-model="selectedCountries"
      :items="countries"
      chips
      label="Select countries"
    >
      <template v-slot:selection="data">
        <v-chip
          :key="JSON.stringify(data.item.name)"
          v-bind="data.attrs"
          :input-value="data.selected"
          :disabled="data.disabled"
          @click.stop="data.parent.selectedIndex = data.index"
          @click:close="data.parent.selectItem(data.item.name)"
        >
          <v-avatar left>
            <img :src="data.item+'.png'" height="25px" />
          </v-avatar>
          {{ data.item }}
        </v-chip>
      </template>
    </v-combobox>
    <v-layout wrap>
      <v-flex v-for="sponsor in sponsorsByCountry" :key="id" xs2>
        <v-card color="#152e63" min-height="300px" raised dark>
          <v-img contain :src="sponsor.logoURL" height="200px"></v-img>
          <v-card-text>
            <span class="nowrap">{{sponsor.name}}</span>
            <br />
            <span class="text--primary">
              <a :href="sponsor.websiteURL">Website</a>
            </span>
            <span>
              <v-img
                :key="name"
                position="left"
                v-for="country in sponsor.countries"
                contain
                :src="country.name+'.png'"
                height="25px"
              ></v-img>
            </span>
          </v-card-text>
        </v-card>
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
  },
  data() {
    return {
      countries: ["denmark", "sweden", "norway", "finland"],
      selectedCountries: ["denmark", "sweden", "norway", "finland"]
    };
  },
  computed: {
    sponsorsByCountry() {
      if (this.sponsors != undefined) {
        return this.sponsors.filter(x => {
          let valid = true;
          x.countries.forEach(country => {
            valid = this.selectedCountries.includes(country.name);
          });
          return valid;
        });
      }
    }
  }
};
</script>

<style scoped>
.nowrap {
  white-space: nowrap;
}
</style>
