<template>
  <v-container fluid class="section-one">
    <v-row>
      <v-spacer></v-spacer>
      <v-col sm="12" md="4" lg="4" cols="12">
        <h1>Hej! Hallå!</h1>
        <h1>Hallo! Hei! Halló!</h1>
        <br />
        <h1>Welcome to</h1>
        <h1>Cloud Native Nordics</h1>
      </v-col>
      <v-col sm="12" md="4" lg="4" cols="12" justify="right" align="right" class="d-none d-lg-flex">
        <v-img contain src="/map.png" />
      </v-col>
      <v-col sm="12" md="4" lg="4" cols="12" class="d-flex d-lg-none">
        <v-img contain src="/map.png" />
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>