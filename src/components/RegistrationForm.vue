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
      <div class="form-example">
        <label>Avatar/Image:</label>
        <input type="file" accept="image/*" @change="selectImage">
      </div>
      <div class="form-example">
        <label>About Me:</label>
        <input type="text" id="me_text"  v-model="me_text">
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
        selectedImage: null,
        me_text: "",
      };
    },
    methods: {
      async register() {
        let imagePath = "";
        if (this.selectedImage) {
          const formData = new FormData();
          formData.append("image", this.selectedImage);

          // Use the Fetch API to upload the image to the server
          try {
            const response = await fetch("/upload", {
              method: "POST",
              body: formData,
            });

            if (response.ok) {
              imagePath = await response.text();
            } else {
              console.error("Image upload failed");
            }
          } catch (error) {
          console.error("Image upload error:", error);
          }
        }
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
          avatar: imagePath,
          about_me: this.me_text,
        };

        this.$socket.send(JSON.stringify(registrationData))
        this.$socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.uuid=="Nickname is used" || data.uuid=="Email is used"){
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
      navigateToLoginPage() {
        this.$router.push('/login'); // Navigate to the Login page
      },
      selectImage(event) {
        this.selectedImage = event.target.files[0];
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