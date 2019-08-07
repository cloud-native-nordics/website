<template>
  <v-app dark>
    <v-bottom-navigation app dark grow fixed :value="activeBtn" color="#326ce5">
      <v-btn to="/meetup-groups">
        <span>Meetup Groups</span>
        <v-icon>device_hub</v-icon>
      </v-btn>

      <v-btn to="/speakers">
        <span>Speakers</span>
        <v-icon>record_voice_over</v-icon>
      </v-btn>

      <v-btn to="/" style="position: relative;">
        <span>Cloud Native Nordics</span>
        <v-icon>record_voice_over</v-icon>
        <img style="position:absolute; top: -35px;" height="100" width="100" src="/snowflake-menu.png">
      </v-btn>

      <v-btn to="/sponsors">
        <span>Sponsors</span>
        <v-icon>attach_money</v-icon>
      </v-btn>

      <v-btn to="/members">
        <span>Members</span>
        <v-icon>group</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <v-content>
      <Nuxt />
    </v-content>
  </v-app>
</template>
<script>
export default {
  data() {
    return {
      activeBtn: 2
    };
  }
};
</script>
<style>
body {
  overflow: hidden;
}
.dark {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  background: black;
  color: white;
  padding: 10px;
}
.dark a {
  color: white;
}
</style>