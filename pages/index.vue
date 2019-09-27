<template>
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

</template>

<script>
import SlackInvite from "~/graphql/slackInvite.gql";
export default {
  components: {},
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
