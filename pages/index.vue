<template>
  <v-container grid-list-md text-center fill-height>
    <v-layout align-center justify-space-around column>
      <v-flex xs-12>
        <v-img src="mascot.png" />
        
      </v-flex>

      <v-layout align-center justify-center row fill-height>
        <v-flex xs-12 mr-5>
          <v-btn class="custom-btn" href="https://github.com/cloud-native-nordics" target="_blank" icon min-height="120" min-width="120">
            <v-img src="github.png" />
          </v-btn>
        </v-flex>

        <v-flex xs-12 ml-5>
          <v-btn class="custom-btn" href="https://www.cloudnativenordics.com" target="_blank" icon min-height="120" min-width="120">
            <v-img src="slack.png" />
          </v-btn>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  components: {}
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
