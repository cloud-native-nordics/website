<template>
  <v-container grid-list-md text-center fill-height>
    <v-layout align-center justify-space-around column>
      <v-img class="d-none d-sm-flex" width="25%" src="snowflake.png" />
      <v-img class="d-flex d-sm-none" width="50%" src="snowflake.png" />
      <h1 class="mt-5">Cloud Native Nordics</h1>

      <br>
      <h3>Join our slack community</h3>
      <v-flex xs-12 mr-5>
        <v-text-field
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

      <v-layout align-center justify-center row fill-height>
        <v-flex xs-12 mr-5>
          <v-btn
            class="custom-btn"
            href="https://github.com/cloud-native-nordics"
            target="_blank"
            icon
            min-height="120"
            min-width="120"
          >
            <v-img src="github.png" class="primary-overlay" />
          </v-btn>
        </v-flex>

        <v-flex xs-12 ml-5>
          <v-btn
            class="custom-btn"
            href="https://www.cloudnativenordics.com"
            target="_blank"
            icon
            min-height="120"
            min-width="120"
          >
            <v-img src="slack.png" class="primary-overlay" />
          </v-btn>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
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
