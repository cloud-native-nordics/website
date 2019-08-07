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
    <v-layout wrap>
      <v-flex v-for="speaker in speakersByCountry" :key="id" xs2>
        <v-card color="#152e63" min-height="200px" raised dark>
          <v-card-title>
            <router-link :to="'/speakers/'+speaker.id">{{speaker.name}}</router-link>
          </v-card-title>
          <v-card-text>
            <span class="text--primary .text-no-wrap">
              {{speaker.title ? speaker.title : "No title"}} @
              <router-link
                v-if="speaker.company"
                :to="'/company/'+speaker.company.id"
                target="_blank"
              >{{speaker.company.name}}</router-link>
            </span>
            <br />
            <span class="text--primary .text-no-wrap">
              <a
                v-if="speaker.email"
                :href="'mailto:'+speaker.email"
                target="_top"
              >{{speaker.email}}</a>
              <span v-else>No email</span>
            </span>
          </v-card-text>
          <v-card-actions>
            <v-layout align-end justify-center row fill-height>
              <v-flex xs3>
                <router-link
                  :key="name"
                  v-for="country in speaker.countries"
                  :to="'/meetup-groups?country='+country.name"
                >
                  <img position="left" contain :src="country.name+'.png'" height="25px">
                </router-link>
              </v-flex>
              <v-flex xs3>
                <a
                  :href="speaker.github ? 'https://github.com/'+ speaker.github : 'https://github.com/'"
                  target="_blank"
                >
                  <img position="left" contain src="github.png" height="25px">
                </a>
              </v-flex>
              <v-flex xs3>
                <a
                  :href="speaker.speakersBureau ? 'https://www.cncf.io/speaker/'+speaker.speakersBureau : 'https://www.cncf.io/speakers/'"
                  target="_blank"
                >
                  <img position="left" contain src="cncf.png" height="25px">
                </a>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import speakers from "~/graphql/speakers.gql";
export default {
  apollo: {
    speakers: {
      query: speakers
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
    speakersByCountry() {
      if (this.speakers != undefined) {
        return this.speakers
          .filter(x => {
            let valid = true;
            x.countries.forEach(country => {
              valid = this.selectedCountries.includes(country.name);
            });
            return valid;
          })
          .filter(x => {
            if (this.searchText === "" || x.name.toLowerCase().includes(this.searchText.toLowerCase())) {
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
