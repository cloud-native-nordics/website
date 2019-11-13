<template>
      <v-row>
      <v-col>
        <h3>Description</h3>
        <div class="pl-5 pr-5 pt-3" v-html="description"></div>
      </v-col>
    </v-row>
</template>

<script>
export default {
  props: ["description"]
}
</script>

<style>

</style>