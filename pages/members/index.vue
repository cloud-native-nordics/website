<template>
  <v-container v-if="membersByCountry" grid-list-lg fluid>
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
      <v-flex v-for="member in membersByCountry" :key="id" xs2>
        <v-card color="#152e63" raised dark min-height="300px" light>
          <v-img contain :src="member.logoURL" height="200px"></v-img>
          <v-card-text>
            <span class="black--text nowrap">{{member.name}}</span>
            <br />
            <span class="text--primary">
              <a :href="member.websiteURL">Website</a>
            </span>
            <span>
              <v-img
                :key="name"
                position="left"
                v-for="country in member.countries"
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
import members from "~/graphql/members.gql";
export default {
  apollo: {
    members: {
      query: members
    }
  },
  data() {
    return {
      countries: ["denmark", "sweden", "norway", "finland"],
      selectedCountries: ["denmark", "sweden", "norway", "finland"]
    };
  },
  computed: {
    membersByCountry() {
      if (this.members != undefined) {
        return this.members.filter(x => {
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
