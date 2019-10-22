<template>
  <section>
    <v-container grid-list-lg fluid>
      <v-layout row fill-height class="pt-5 pb-5 d-flex flex-wrap flex-md-nowrap">
        <headline text="events"></headline>
      </v-layout>

    </v-container>
  </section>
</template>

<script>
import events from "~/graphql/events.gql";
import Headline from "~/components/common/Headline.vue";
export default {
  components: {
    Headline: Headline
  },
};
</script>

<style scoped>
.nowrap {
  white-space: nowrap;
}
</style>
