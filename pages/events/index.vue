<template>
  <v-container grid-list-lg fluid>
    <v-layout row fill-height class="pt-5 pb-2 d-flex flex-wrap flex-md-nowrap">
      <headline text="events"></headline>
      <country-filter :selectedCountry="selectedCountry" @selectCountry="setSelectedCountry"></country-filter>
    </v-layout>
    <h3 class="pb-3 pt-3">Upcoming Events</h3>
    <v-layout wrap align-center class="pl-5 pr-5">
      <v-flex v-for="event in futureEvents" :key="event.id" xs12 md6 lg4>
        <v-card>
          <v-card-title>
            <a
              :href="`https://meetup.com/${event.meetupGroup.meetupID}/events/${event.id}`"
              target="_blank"
            >{{ event.name }}</a>
          </v-card-title>
          <v-card-text>
            <v-img position="center" contain :src="event.photo" height="250px"></v-img>
          </v-card-text>
          <v-card-actions class="card-footer">
            <div class="d-none d-sm-flex">
              @
              <b>{{event.venue}}</b>
              , {{ event.address }}, {{event.meetupGroup.city}}.&nbsp
              <b>On</b>
              &nbsp{{ formattedDate(event.date) }}
            </div>
            <div class="d-flex d-sm-none">
              {{event.meetupGroup.city}}&nbsp
              &nbsp{{ formattedDate(event.date) }}
            </div>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <h3 class="pb-3 pt-3">Past Events</h3>
    <v-layout wrap align-center class="pl-5 pr-5">
      <v-flex v-for="event in pastEvents" :key="event.id" xs12 md6 lg4>
        <v-card>
          <v-card-title>
            <a
              :href="`https://meetup.com/${event.meetupGroup.meetupID}/events/${event.id}`"
              target="_blank"
            >{{ event.name }}</a>
          </v-card-title>
          <v-card-text>
            <v-img position="center" contain :src="event.photo" height="250px"></v-img>
          </v-card-text>
          <v-card-actions class="card-footer">
            <div class="d-none d-sm-flex">
              @
              <b>{{event.venue}}</b>
              , {{ event.address }}, {{event.meetupGroup.city}}.&nbsp
              <b>On</b>
              &nbsp{{ formattedDate(event.date) }}
            </div>
            <div class="d-flex d-sm-none">
              {{event.meetupGroup.city}}&nbsp
              &nbsp{{ formattedDate(event.date) }}
            </div>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from "moment";
import meetups from "~/graphql/events.gql";
import CountryFilter from "~/components/common/CountryFilter.vue";
import Headline from "~/components/common/Headline.vue";
export default {
  components: {
    CountryFilter: CountryFilter,
    Headline: Headline
  },
  apollo: {
    meetups: {
      query: meetups
    }
  },
  data() {
    return {
      selectedCountry: "all countries",
      searchText: ""
    };
  },
  computed: {
    futureEvents() {
      if (this.eventsByCountry != undefined) {
        return this.eventsByCountry
          .filter(x => {
            let valid = false;
            if (!valid) {
              valid = new Date(x.date) >= new Date();
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
          }).sort((a, b) => {
            return new Date(a.date) - new Date(b.date); // Sort upcoming meetups so that the closest one in time is displayed first
          });
      }
    },
    pastEvents() {
      if (this.eventsByCountry != undefined) {
        return this.eventsByCountry
          .filter(x => {
            let valid = false;
            if (!valid) {
              valid = new Date(x.date) <= new Date();
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
    },
    eventsByCountry() {
      if (this.sortedMeetups != undefined) {
        return this.sortedMeetups
          .filter(x => {
            let valid = false;
            if (!valid) {
              valid =
                this.selectedCountry === x.meetupGroup.country ||
                this.selectedCountry === "all countries";
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
    },
    sortedMeetups() {
      if (this.meetups) {
        this.meetups.forEach(meetup => {
          if (meetup.sponsors) {
            let venueSponsor = meetup.sponsors.filter(
              sponsor => sponsor.role === "Venue"
            );

            if (venueSponsor.length > 0) {
              meetup.venue = venueSponsor[0].company.name;
            } else {
              meetup.venue = "Not defined";
            }
          }
        });

        return this.meetups.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
      } else {
        return [];
      }
    }
  },
  methods: {
    formattedDate: function(date) {
      return moment(date).format("YYYY-MM-DD");
    },
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
