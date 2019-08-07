<template>
  <v-container v-if="membersByCountry" grid-list-lg fluid>
    <v-layout justify-space-between row fill-height>
      <v-flex xs3>
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
      </v-flex>
      <v-flex xs3>
        <v-text-field
          class="search-box"
          v-model.lazy="searchText"
          small
          outline
          label="Search"
          prepend-inner-icon="search"
          single-line
          hide-details
          clearable
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex v-for="member in membersByCountry" :key="id" xs2>
        <v-card color="#152e63" raised dark min-height="300px" light>
          <v-card-title>
            <v-img contain :src="member.logoURL" height="200px"></v-img>
          </v-card-title>
          <v-card-text>
            <span class="nowrap">{{member.name}}</span>
            <br />
            <span class="text--primary">
              <a :href="member.websiteURL">Website</a>
            </span>
          </v-card-text>
          <v-card-actions>
            <v-layout align-center justify-space-around row fill-height>
              <v-flex xs4 :key="name" v-for="country in member.countries">
                <router-link :key="name" :to="'/meetup-groups?country='+country.name">
                  <v-img position="center" contain :src="country.name+'.png'" height="25px"></v-img>
                </router-link>
              </v-flex>
            </v-layout>
          </v-card-actions>
          <br>
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
      selectedCountries: ["denmark", "sweden", "norway", "finland"],
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
              valid = this.selectedCountries.includes(country.name);
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
  }
};
</script>

<style scoped>
.nowrap {
  white-space: nowrap;
}
</style>
