<template>
  <v-container grid-list-lg fluid>
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
    <v-layout wrap align-center>
      <v-flex v-for="meetupGroup in meetupGroupsByCountry" :key="meetupID" xs4>
        <v-card color="#152e63" min-height="200px" raised dark>
          <v-card-title>
            <router-link :key="name" :to="'/meetup-groups/'+meetupGroup.meetupID">
              <v-img
                position="center"
                contain
                :src="meetupGroup.city.toLowerCase()+'.jpeg'"
                height="250px"
              ></v-img>
            </router-link>
          </v-card-title>
          <v-card-text class="text-center font-weight-bold title">{{meetupGroup.name}}</v-card-text>
          <v-card-actions>
            <v-layout align-center justify-center row fill-height>
              <v-flex xs4>
                <span
                  @click="setSelectedCountry(meetupGroup.country)"
                  :key="name"
                  :href="'/meetup-groups?country='+meetupGroup.country"
                >
                  <v-img position="center" contain :src="meetupGroup.country+'.png'" height="25px"></v-img>
                </span>
              </v-flex>
              <v-flex xs4>
                <a
                  :href="meetupGroup.city ? 'https://github.com/cloud-native-nordics/meetups/tree/master/'+ meetupGroup.city.toLowerCase() : 'https://github.com/cloud-native-nordics/meetups/tree/master/'"
                  target="_blank"
                >
                  <v-img position="center" contain src="github.png" height="25px"></v-img>
                </a>
              </v-flex>
              <v-flex xs4>
                <a
                  :href="meetupGroup.meetupID ? 'https://www.meetup.com/'+meetupGroup.meetupID : 'https://www.meetup.com/'"
                  target="_blank"
                >
                  <v-img position="center" contain src="meetup.png" height="25px"></v-img>
                </a>
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
import meetupGroups from "~/graphql/meetupGroups.gql";
export default {
  apollo: {
    meetupGroups: {
      query: meetupGroups
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
    meetupGroupsByCountry() {
      if (this.meetupGroups != undefined) {
        return this.meetupGroups
          .filter(x => {
            return this.selectedCountries.includes(x.country);
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
      this.selectedCountries = [this.$route.query.country];
    }
  },
  methods: {
    setSelectedCountry(country) {
      console.log(country)
      this.selectedCountries = [country];
    }
  }
};
</script>

<style scoped>
.nowrap {
  white-space: nowrap;
}
</style>
