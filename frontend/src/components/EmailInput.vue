<template>
    <div>
        <p>Enter your email and password</p>
        <div id="inputs">

          <div id="one_input">
            <label for="email">Email:</label>
              <input id="email" type="text" v-model="email">
          </div>

          <div id="one_input">
            <label for="pwd">Password:</label>
            <input id="pwd" type="password" v-model="password">
          </div>

        </div>
        <button @click="login">Log In</button>
    </div>
    <!-- <Headers account: {email: this.email, password: this.password} /> -->
    <p>{{ header }}</p>
  </template>
  
  <script>
    import axios from "axios";
    export default {
      name: 'EmailInput',
      data () {
        return {
          email: '', 
          password: '',
          header: '',
        }
      },
      methods: {
        login() {
          // console.log(this.email, this.password);
          const body = {
            email: this.email,
            password: this.password
          };
          console.log(body);
          axios.post("http://localhost:8081/", body)
            .then((response) => {
              console.log(response.data);
              this.header = response.data.header;
            })
        },
      }
    }
  </script>

<style>
#inputs {
  display: flex;
  flex-direction: column;
  width: fit-content;
  margin: auto;
  align-items: flex-start;
}

</style>