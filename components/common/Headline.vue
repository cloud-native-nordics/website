<template>
  <v-flex xs6 class="text-uppercase">
    <h1 class="d-none d-lg-flex">{{text}}</h1>
    <h2 class="d-none d-md-flex d-lg-none pt-2">{{text}}</h2>
    <h3 class="d-flex d-md-none pt-3">{{text}}</h3>
  </v-flex>
</template>
<script>
export default {
  props: ["text"]
}
</script>
<style lang="sass" scoped>

</style>