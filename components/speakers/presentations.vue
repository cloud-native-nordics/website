<template>
  <div>
    <v-row class="pl-5 pr-5">
      <v-col cols="12">
        <v-list two-line>
          <v-list-item
            v-for="presentation in filteredPresentations"
            :key="presentation.title"
            nuxt
            :to="'/presentations/'+presentation.id"
          >
            <v-list-item-content>
              <v-list-item-title v-text="presentation.title"></v-list-item-title>
              <v-list-item-subtitle>
                {{presentation.meetup.name}}
                <br>
                @{{new Date(presentation.meetup.date).toLocaleDateString()}} - {{presentation.duration}}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["presentations"],
  computed: {
    filteredPresentations(){
      return this.presentations.filter(presentation => {
        let time = presentation.duration.substring(0,2)
        let duration = parseInt(time)
        if(duration > 15){
          return true
        }else{
          return false
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
</style>