<template>
  <v-footer app absolute height="100px">
    <v-row align="center">
      <v-spacer></v-spacer>
      <v-col cols="3" md="3" sm="3">
        <v-list-item style="justify-content:center">
          <v-list-item-icon>
            <a href="https://github.com/cloud-native-nordics" target="_blank">
              <v-img max-height="32px" src="/GitHub-Mark-32px.png" class="github" />
            </a>
          </v-list-item-icon>
          <a
            class="d-none d-md-flex"
            href="https://github.com/cloud-native-nordics"
            target="_blank"
          >github.com/cloud-native-nordics</a>
        </v-list-item>
      </v-col>
      <v-col cols="3" md="3" sm="3">
        <v-list-item style="justify-content:center">
          <v-list-item-icon>
            <a href="https://twitter.com/hashtag/CloudNativeNordics" target="_blank">
              <v-img max-height="36px" src="/twitter.png" class="github" />
            </a>
          </v-list-item-icon>
          <a
            class="d-none d-md-flex"
            href="https://twitter.com/hashtag/CloudNativeNordics"
            target="_blank"
            style="display:inline-blok"
          >#CloudNativeNordics</a>
        </v-list-item>
      </v-col>
      <v-col cols="3" md="3" sm="3">
        <div style="text-align:center">
          <a href="https://digitalocean.com" target="_blank">
            <img class="d-none d-md-flex" width="155px" src="/DO_Powered_by_Badge_blue.png" />
            <img class="d-flex d-md-none" width="100px" src="/DO_Powered_by_Badge_blue.png" />
          </a>
        </div>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-footer>
</template>
<script>
export default {
  computed: {}
};
</script>