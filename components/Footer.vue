<template>
    <v-footer fluid class="footer">
    <v-row>
      <v-col cols="2"></v-col>
      <v-col cols="4" justify="left" align="left">
        <v-layout align-center>
          <img width="32px" src="/GitHub-Mark-32px.png" />
          <v-flex fill-height>
            &nbsp;<a href="github.com/cloud-native-nordics">github.com/cloud-native-nordics</a>
          </v-flex>
        </v-layout>
        <p>#CloudNativeNordics</p>
      </v-col>
      <v-col cols="4"
      justify="right"
      align="right">
      <v-img width="30%" src="/DO_Powered_by_Badge_blue.png" />
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
  </v-footer>
</template>

<script>
  export default {
    name: 'Footer'
  }
</script>