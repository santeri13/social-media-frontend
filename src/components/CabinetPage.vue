<template>
    <div>
        <header>
            <div id="buttons">
                <button id="mainButton" @click="navigateToMainPage">Main Page</button>
                <button id="privateMesssage" @click="navigateToPrivateMesssage">Messages</button>
                <button id="logoutButton" @click="logout">Logout</button>
            </div>
        </header>
        <div class="cabinet-container">
            <form @submit.prevent="change" class="form-example">
                <div class="form-example">
                    <label>Nickname:</label>
                    <input type="text" id="nickname" name="nickname" v-model="nickname">
                </div>
                <div class="form-example">
                    <label>First name:</label>
                    <input type="text" id="firstname" name="firstname" v-model="firstname">
                </div>
                <div class="form-example">
                    <label>Last name:</label>
                    <input type="text" id="lastname" name="lastname" v-model="lastname">
                </div>
                <div class="form-example">
                    <label>Age:</label>
                    <input type="number" id="age" name="age" v-model="age">
                </div>
                <div class="form-example">
                    <label>Gender:</label>
                    <input type="text" id="gender" name="gender" v-model="gender">
                </div>
                <div class="form-example">
                    <label>Email:</label>
                    <input type="email" id="email" name="email" v-model="email">
                </div>
                <button type="submit">Update</button>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
      return {
        userid: "",
        nickname: "",
        firstname: "",
        lastname: "",
        age: 0,
        gender: "",
        email: "",
      };
    },
    mounted() {
      this.userid = getCookieValue()
      const cabinetJSON = {
          type: "cabinet", 
          uuid: getCookieValue(),
        };
      this.$socket.send(JSON.stringify(cabinetJSON))
      this.$socket.onmessage = (event) =>{
        const data = JSON.parse(event.data);
        this.nickname = data.Nickname;
        this.firstname = data.FirstName;
        this.lastname = data.LastName;
        this.age = data.Age;
        this.gender = data.Gender;
        this.email = data.Email;
      }
    },
    methods: {
        change() {
            const changeData = {
                type: "change",
                userid: this.userid,
                nickname: this.nickname,
                firstname: this.firstname,
                lastname: this.lastname,
                age: this.age,
                gender: this.gender,
                email: this.email,
            };
            this.$socket.send(JSON.stringify(changeData))
            this.$router.push('/cabinet');
        },
        navigateToMainPage() {
            this.$router.push('/');
        },
        navigateToPrivateMesssage() {
            this.$router.push('/messages'); 
        },
        logout() {
            document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            this.$router.push('/'); 
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
  .cabinet-container {
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