<template>
  <section style="color: white;">
  <v-parallax
    dark
    src="cover2.png"
  >
    <v-row align="center" justify="center">
      <h1 class="mt-12">Cloud Native Nordics</h1>
    </v-row>
    <v-row align="center" justify="center">
      <h3>Join our slack community</h3>
    </v-row>
    <v-row align="center" justify="center">
        <v-text-field
          color="#FFFFFF"
          label="Email"
          outlined
          append-icon="mdi-arrow-right-circle"
          v-model="email"
          @click:append="sendInvite"
        ></v-text-field>

      <v-col md="6" offset-md="3">
      <v-snackbar color="primary" multi-line timeout="20000" v-model="snackbar">
        <span v-html="response"></span>
        <v-btn text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
      </v-col>
      </v-row>

  </v-parallax>
  <v-container grid-list-md text-center fill-height>
    <v-layout align-center justify-space-around column>
      <h1 class="mt-5">Cloud Native Nordics</h1>
      <br>
      <h3>Join our slack community</h3>
      <v-flex xs-12 mr-5>
        <v-text-field
          color="#FFFFFF"
          label="Email"
          outlined
          append-icon="mdi-arrow-right-circle"
          v-model="email"
          @click:append="sendInvite"
        ></v-text-field>
      </v-flex>
      <v-snackbar color="primary" multi-line timeout="20000" v-model="snackbar">
        <span v-html="response"></span>
        <v-btn text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </v-layout>
  </v-container>
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
