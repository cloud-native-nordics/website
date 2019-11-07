<template>
  <v-container fluid class="section-four">
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="8" justify="center" align="center">
        <v-row justify="center">
                <h2>Cloud Native Nordics is rapidly growing</h2><br/>
                <p>... so far we have gathered...</p>
        </v-row>
        <br />
        <v-row justify="center" align="center">
          <v-col sm="12" md="6" lg="3" cols="12" justify="center" align="center">
            <v-img width="40%" src="/icon_group.png" />
            <h1 style="font-weight: 800; font-size: 55px;">{{ meetupGroupsCount }}</h1>
            <h3 style="font-weight: 400; font-size: 35px;">groups</h3>
          </v-col>
          <v-col sm="12" md="6" lg="3" cols="12">
            <v-img width="40%" src="/icon_meetups.png" />
            <h1 style="font-weight: 800; font-size: 55px;">{{ totalMembers }}</h1>
            <h3 style="font-weight: 400; font-size: 35px;">members</h3>
          </v-col>
          <v-col sm="12" md="6" lg="3" cols="12">
            <v-img width="40%" src="/icon_members.png" />
            <h1 style="font-weight: 800; font-size: 55px;">{{ meetupsCount }}</h1>
            <h3 style="font-weight: 400; font-size: 35px;">meetups</h3>
          </v-col>
          <v-col sm="12" md="6" lg="3" cols="12">
            <v-img width="40%" src="/icon_avg_rsvp.png" />
            <h1 style="font-weight: 800; font-size: 55px;">{{ averageAttendees }}</h1>
            <h3 style="font-weight: 400; font-size: 35px;">avg. rsvps</h3>
          </v-col>
        </v-row>
        <br />
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
import meetupGroups from "~/graphql/meetupGroups.gql";
import meetups from "~/graphql/meetups.gql";
export default {
  components: {},
  apollo: {
    meetupGroups: {
      query: meetupGroups
    },
    meetups: {
      query: meetups
    }
  },
  computed: {
    meetupGroupsCount() {
      if (this.meetupGroups) {
        return this.meetupGroups.length;
      } else {
        return 0;
      }
    },
    meetupsCount() {
      if (this.meetups) {
        return this.meetups.length;
      } else {
        return 0;
      }
    },
    averageAttendees() {
      if (this.meetups) {
        var total = 0;
        for (var i = 0; i < this.meetups.length; i++) {
          total = total + this.meetups[i].attendees;
        }
        return Math.ceil(total / this.meetups.length);
      } else {
        return 0;
      }
    },
    totalMembers() {
      if (this.meetupGroups) {
        var total = 0;
        for (var i = 0; i < this.meetupGroups.length; i++) {
          total = total + this.meetupGroups[i].memberCount;
        }
        return total;
      } else {
        return 0;
      }
    }
  }
};
</script>