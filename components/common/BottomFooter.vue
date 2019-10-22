<template>
  <v-footer app absolute>
    <v-layout justify-center row wrap>
      <v-col cols="12" md="4" sm="4">
        <v-layout>
          <v-img max-height="32px" src="/GitHub-Mark-32px.png" class="github" />
          <v-flex fill-height>
            &nbsp;
            <a href="https://github.com/cloud-native-nordics" target="_blank">github.com/cloud-native-nordics</a>
          </v-flex>
        </v-layout>
        <p>#CloudNativeNordics</p>
      </v-col>
      <v-col cols="12" md="4" sm="4" :align="align">
        <v-img width="185px" src="/DO_Powered_by_Badge_blue.png" />
      </v-col>
    </v-layout>
  </v-footer>
</template>
<script>
export default {
  computed: {
    align() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "left";
        default:
          return "right";
      }
    }
  }
};
</script>