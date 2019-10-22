<template>
  <v-container fluid class="section-two">
    <v-row>
      <v-spacer></v-spacer>
      <v-col sm="12" md="4" lg="4" cols="12">
        <h3 class="d-none d-md-flex">Join our Slack community</h3>
        <h3 class="d-block d-md-none d-sm-block text-center pl-0">Join our Slack community</h3>
      </v-col>
      <v-col sm="12" md="4" lg="4" cols="12">
        <v-text-field
          label="Email"
          append-icon="mdi-arrow-right-circle"
          v-model="email"
          @click:append="sendInvite"
          color="purple"
          solo
          placeholder="Enter email..."
        ></v-text-field>

        <v-snackbar color="primary" multi-line :timeout="20000" v-model="snackbar">
          <span v-html="response"></span>
          <v-btn text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
import SlackInvite from "~/graphql/slackInvite.gql";
export default {
  data: () => ({
    email: "",
    response: "",
    snackbar: false
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