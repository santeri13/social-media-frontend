<template>
  <div class="registration-container">
    <form @submit.prevent="login" class="form-example">
      <div class="form-example">
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="form-example">
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
      <p>Don't have an account? <a @click="navigateToRegistrationPage" class="register-link">Register</a></p>
    </form>
  </div>
</template>
  
<script>
  export default {
    data() {
      return {
        email: "",
        password: "",
      };
    },
    methods: {
      login() {
        // Send login data to the backend using API call
        const loginData = {
          type: "login",
          email: this.email,
          password: this.password,
        };
        this.$socket.send(JSON.stringify(loginData))
        this.$socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.uuid == "Invalid email or password"){
            alert(data.uuid);
          }
          else{
            document.cookie = "userID=" + data.uuid + "; max-age=86400; path=/";
            const userUUIDData = {
                type: "user_uuid",
                uuid: getCookieValue(),
            };
            this.$socket.send(JSON.stringify(userUUIDData))
            this.$router.push('/');
          }
        }
      },
      navigateToRegistrationPage() {
        this.$router.push('/register'); // Navigate to the Registration page
      },
    },
  };

function getCookieValue() {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split("=");
    if (cookie[0] === "userID") {
      return cookie.slice(1).join("=");
    }
  }
  return "";
}
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