<script>
import HomePage from './components/HomePage.vue'
import EmailInput from './components/EmailInput.vue';

export default {
  name: 'App',
  components: {
    HomePage,
    EmailInput
  },
  methods: {
  }
}
</script>

<template>
  <div id="app">
    <HomePage msg="Welcome"/>
    <EmailInput/>
  </div>
</template>

<style>
#app {
  font-family: "Poppins", sans-serif;
  text-align: center;
  color: #000000;
  margin-top: 3rem;
}
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
</style>
