<template>
  <section style="color: black;">

  <v-container fluid
    style="background-color: #ffffff; height: 400px;">
    <v-row>
      <v-col cols="2"></v-col>
      <v-col cols="4">
      <h1 style="top:30px;">Hej! Hallå!</h1>
      <h1>Hallo! Hei! Halló!</h1>
      </br>
      <h1>Welcome to</h1>
      <h1>Cloud Native Nordics</h1>
      </v-col>
      <v-col cols="4" justify="right" align="right">
      <v-img width="70%" src="/map.png" />
      </v-col>
      <v-col cols="2"></v-col>
      </v-row>
  </v-container>

  <v-container fluid
    style="background-color: #dddddd; height: 100px;">
    <v-row>
      <v-col cols="2"></v-col>
      <v-col cols="4">
      <h3>Join our Slack community</h3>
      </v-col>
      <v-col cols="4">
        <v-text-field
          label="Email"
          outlined
          append-icon="mdi-arrow-right-circle"
          v-model="email"
          @click:append="sendInvite"
          style="color: #512268;"></v-text-field>

        <v-snackbar color="primary" multi-line timeout="20000" v-model="snackbar">
          <span v-html="response"></span>
          <v-btn text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
      </v-col>
      <v-col cols="2"></v-col>
      </v-row>
  </v-container>

  <v-container fluid
    style="background-color: #F11F7E; height: 260px; color: white;">
    <v-row>
      <v-col cols="2"></v-col>
      <v-col cols="8"
        justify="center"
        align="center">
      <h2 style="color: white; margin-top: 40px;">Building and scaling the adoption of Cloud Native in the nordics</h2>
      </br>
      <p style="margin-bottom:40px;">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
  </v-container>

   <v-container fluid
    style="background-color: white; height: 400px; color: #512268;">
    <v-row>
      <v-col cols="2"></v-col>
      <v-col cols="8"
        justify="center"
        align="center">
        <v-row justify="center">
          </br>
          Cloud Native Nordics is rapidly growing, and so far we've gathered
        </v-row>
        </br>
        <v-row justify="center" align="center">
              <v-col cols="2" justify="center" align="center">
                <v-img width="40%" src="/icon_group.png" />
                <h1 style="font-weight: 800; font-size: 55px;">12</h1>
                <h3 style="font-weight: 400; font-size: 35px;">groups</h3>
              </v-col>
              <v-col cols="2">
                <v-img width="40%" src="/icon_meetups.png" />
                <h1 style="font-weight: 800; font-size: 55px;">5372</h1>
                <h3 style="font-weight: 400; font-size: 35px;">members</h3>
              </v-col>
              <v-col cols="2">
                <v-img width="40%" src="/icon_members.png" />
                <h1 style="font-weight: 800; font-size: 55px;">84</h1>
                <h3 style="font-weight: 400; font-size: 35px;">meetups</h3>
              </v-col>
              <v-col cols="2">
                <v-img width="40%" src="/icon_avg_rsvp.png" />
                <h1 style="font-weight: 800; font-size: 55px;">53</h1>
                <h3 style="font-weight: 400; font-size: 35px;">avg. rsvps</h3>
              </v-col>
        </v-row>
      </br>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>

  </v-container>

   <v-container fluid
    style="background-color: #512268; height: 500px; color: white;">
    <v-row>
      <v-col cols="2"></v-col>
      <v-col cols="4"
        justify="center"
        align="center">
        <v-img width="45%" src="/mascot.png" />
      </v-col>
      <v-col cols="4"
        justify="center"
        align="center">
        <h2 style="color: white;">Upcoming events</h2>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
  </v-container>

  <v-container fluid
    style="background-color: #dddddd; height: 150px;">
    <v-row>
      <v-col cols="2"></v-col>
      <v-col cols="4"
        justify="left"
        align="left">
      <h3>github.com</h3>
      </v-col>
      <v-col cols="4"
        justify="right"
        align="right">
        <v-img width="30%" src="/DO_Powered_by_Badge_blue.png" />
      </v-col>
      <v-col cols="2"></v-col>
      </v-row>
  </v-container>
  </section>
</template>

<script>
import SlackInvite from "~/graphql/slackInvite.gql";
import Footer from '~/components/Footer.vue';
export default {
  components:{
         'Footer':Footer,
  },
  // slack invite
  data: () => ({
    email: "",
    response: "",
    snackbar: false,
  }),
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
</style>
