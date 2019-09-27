<template>
  <div>
  <section style="color: white;">
  <v-parallax
    dark
    src="cover2.png"
  >
  <v-container>
    <v-row align="center" justify="center">
      <h1 style="color: white;">Welcome to Cloud Native Nordics</h1>
    </v-row>
    <br>
    <v-row align="center" justify="center">
      <h3>Join our slack community</h3>
    </v-row>
    <br>
    <v-row align="center" justify="center">
      <v-col md=4 justify="center" align="center"></v-col>
      <v-col md=4 justify="center" align="center">
        <v-text-field
          label="Email"
          outlined
          append-icon="mdi-arrow-right-circle"
          v-model="email"
          @click:append="sendInvite"
          style="color: white;"></v-text-field>

        <v-snackbar color="primary" multi-line timeout="20000" v-model="snackbar">
          <span v-html="response"></span>
          <v-btn text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
      </v-col>
      <v-col md=4 justify="center" align="center"></v-col>
    </v-row>

    </v-container>

  </v-parallax>

    <br>
    <v-row>
      <v-col md=6 justify="center" align="center">
        <h2>Upcoming meetups</h2>
      </v-col>
      <v-col md=6 justify="center" align="center">
        <h2>Some other stuff</h2>
      </v-col>
    </v-row>
    <br>
  </section>

    <v-layout row fill-height class="pt-5 pb-5">
      <v-flex xs7>
        <h1>STATS</h1>
      </v-flex>
    </v-layout>
    <v-layout wrap align-center>
      <v-flex v-for="(meetup, index) in stats.perMeetup" :key="index" xs12 lg4>
        <v-card text>
          <v-card-title>
          {{index}}
          </v-card-title>
          <v-card-text class="text-center font-weight-bold title">
          <ul style="list-style-type:none">
          <li><a>Sponsors: {{meetup.sponsors}}</a></li>
          <li><a>Speakers: {{meetup.sponsors}}</a></li>
          <li><a>Meetups: {{meetup.meetups}}</a></li>
          <li><a>Members: {{meetup.members}}</a></li>
          <li><a>totalRSVPs: {{meetup.totalRSVPs}}</a></li>
          <li><a>averageRSVPs: {{meetup.averageRSVPs}}</a></li>
          <li><a>uniqueRSVPs: {{meetup.uniqueRSVPs}}</a> </li>
          </ul>

            <router-link
              :key="index"
              :to="'/meetup-groups/'+index"
            >Go to {{index}}</router-link>
          </v-card-text>
          <v-card-actions>
            <v-layout row fill-height>
              <v-flex class="d-flex justify-center" xs12>
                <a
                  class="mr-2"
                  :href="'https://github.com/cloud-native-nordics/meetups/tree/master/'+ index"
                  target="_blank"
                >
                
                  <img contain src="github.png" height="33px" />
                  </a>
              </v-flex>
            </v-layout>
          </v-card-actions>
          <br />
        </v-card>
      </v-flex>
    </v-layout>
  

</div>
</template>

<script>
import SlackInvite from "~/graphql/slackInvite.gql";
export default {
  components: {},
  data: () => ({
    email: "",
    response: "",
    snackbar: false,
    stats: null
  }),
  async asyncData({ $axios }) {
  const jsonStats = await $axios.$get('https://raw.githubusercontent.com/cloud-native-nordics/meetups/master/stats.json')
  return { stats:jsonStats }
},
  methods: {
    sendInvite() {
      this.$apollo
        .mutate({
          mutation: SlackInvite,
          variables: { data: this.email }
        })
        .then(success => {
          this.response = success.data.slackInvite;
          this.snackbar = true;
          this.email = "";
        })
        .catch(error => {});
    }
  }
};
</script>

<style scoped>
.custom-btn::before {
  color: #0400ff;
}

.custom-btn:hover {
  color: #0400ff;
}

ul{
  text-align:left;
}



</style>
