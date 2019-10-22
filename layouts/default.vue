<template>
  <v-app>
    <navigation></navigation>
    <bottom-footer></bottom-footer>
    <v-content>
      <Nuxt />
    </v-content>
  </v-app>
</template>
<script>
import Navigation from "~/components/common/Navigation.vue";
import BottomFooter from "~/components/common/BottomFooter.vue";
export default {
  components: {
    Navigation: Navigation,
    BottomFooter: BottomFooter
  }
};
</script>

<style>
body {
  overflow: hidden;
}
</style>