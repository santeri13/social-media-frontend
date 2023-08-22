<template>
  <div class="registration-container">
    <form @submit.prevent="register" class="form-example">
      <div class="form-example">
        <label for="nickname">Nickname:</label>
        <input type="text" id="nickname" v-model="nickname" required>
      </div>
      <div class="form-example">
        <label for="first_name">First name:</label>
        <input type="text" id="first_name" v-model="firstname" required>
      </div>
      <div class="form-example">
        <label for="last_name">Last name:</label>
        <input type="text" id="last_name" v-model="lastname" required>
      </div>
      <div class="form-example">
        <label for="age">Age:</label>
        <input type="number" id="age" v-model="age" required>
      </div>
      <div class="form-example">
        <label for="gender">Gender:</label>
        <input type="text" id="gender" v-model="gender" required>
      </div>
      <div class="form-example">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-example">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Register</button>
      <p>Already have an account? <a @click="navigateToLoginPage" class="login-link">Login</a></p>
    </form>
  </div>
</template>
  
<script>
  export default {
    data() {
      return {
        nickname:"",
        firstname:"",
        lastname:"",
        age:0,
        gender:"",
        email:"",
        password:"",
        // Other registration form data (first name, last name, etc.)
      };
    },
    methods: {
      register() {
        // Send registration data to the backend using API call
        const registrationData = {
          type: "register",
          nickname: this.nickname,
          firstname: this.firstname,
          lastname: this.lastname,
          age: this.age,
          gender: this.gender,
          email: this.email,
          password: this.password,
        };

        this.$socket.send(JSON.stringify(registrationData))
        this.$router.push('/');
      },
    navigateToLoginPage() {
      this.$router.push('/login'); // Navigate to the Login page
    },
    },
  };
</script>

<style>
  .registration-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  form {
    margin-top: 10px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 60px;
    text-align: center;
  }

  a{
    color: blue;
    font-weight: bold;
    text-decoration: underline;
  }

  a:hover{
    cursor: pointer;
  }

  form.form-example {
    display: table;
  }

  div.form-example {
    display: table-row;
  }

  label,
  input {
    display: table-cell;
    margin-bottom: 10px;
  }

  label {
    padding-right: 10px;
  }

</style>