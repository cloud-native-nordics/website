import Vue from 'vue';

Vue.mixin({
  methods: {
    navigate(route) {
      this.$router.push(route)
    },
  }
})
