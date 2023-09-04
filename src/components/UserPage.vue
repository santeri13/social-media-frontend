
<template>
    <div>
      <header>
        <button id="mainButton" @click="navigateToMainPage">Main Page</button>
        <button id="cabinetButton" @click="navigateToCabinetPage">Profile</button>
        <button id="privateMesssage" @click="navigateToPrivateMesssage">Messages</button>
        <button id="logoutButton" @click="logout">Logout</button>
      </header>
      <main>
        <div v-if="privacy == 'public'">
            <p>{{nickname}}</p>
            <p>{{firstname}}</p>
            <p>{{lastname}}</p>
            <p>{{age}}</p>
            <p>{{gender}}</p>
            <p>{{email}}</p>
            <p v-if="me_text != ''">{{me_text}}</p>
            <img :src="avatar" v-if="avatar != ''">
            <button id="followUser" @click="followUser(userid)">Follow</button>

            <div id="post-feed">
                <h2>Post Feed</h2>
                <template v-for="post in Posts" v-bind:key="post.ID">
                    <ul class="post-list" v-if="post != null">
                        <h3>{{post.Title}}</h3>
                        <p>{{post.Content}}</p>
                        <p>Category: {{post.Category}}</p>
                    </ul>
                </template>
            </div>
        </div>
        <div v-else>
            <h1>This account is private</h1>
            <button id="followUser" @click="followUser(userid)">Follow</button>
        </div>
      </main>
    </div>
  </template>

<script>
export default {
    data() {
      return {
        disabled:false,
        userid: "",
        nickname: "",
        firstname: "",
        lastname: "",
        age: 0,
        gender: "",
        email: "",
        me_text: "",
        avatar:"",
        privacy:"",
        Posts:[],
        followed:false,
      };
    },
    mounted() {
        this.$socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.userid = data.UserID
            this.nickname = data.Nickname;
            this.firstname = data.FirstName;
            this.lastname = data.LastName;
            this.age = data.Age;
            this.gender = data.Gender;
            this.email = data.Email;
            this.avatar = data.Avatar;
            this.me_text = data.About;
            this.privacy = data.privacy;
            const userPosts = {
                type: "user_posts",
                uuid: this.userid,
            };
            this.$socket.send(JSON.stringify(userPosts))
            this.$socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.Posts = data
            }
        }
    },
    methods: {
        navigateToMainPage() {
            const userUUIDData = {
                type: "user_uuid",
                uuid: getCookieValue(),
            };
            this.$socket.send(JSON.stringify(userUUIDData))
            this.$router.push('/');
        },
        navigateToCabinetPage() {
            this.$router.push('/cabinet');
        },
        navigateToPrivateMesssage() {
            this.$router.push('/messages'); 
        },
        logout() {
            document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            this.$router.push('/login'); 
        },
        followUser(userid){
            if (this.followed === true){
                this.followed = false
                this.disabled = false
            }
            else{
                this.followed = true
                this.disabled = true
            }
            const followUser = {
                type: "followUser",
                userid: userid,
                user_uuid: getCookieValue(),
            };
            this.$socket.send(JSON.stringify(followUser))
        }
    }
}

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
.post-list ul {
    list-style-type: none;
    padding: 0;
}
.post-list li {
    border-radius: 60px;
    margin-bottom: 10px;
    padding: 20px;
    border: 1px solid #ddd;
}
.post-list li h3 {
    margin-top: 0;
}

.HeartAnimation {
  padding-top: 2em;
  background-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/66955/web_heart_animation.png');
  background-repeat: no-repeat;
  background-size: 2900%;
  background-position: left;
  height: 50px;
  width: 50px;
  margin: 0 auto;
  cursor: pointer;
}

.animate {
  animation: heart-burst .8s steps(28) forwards;
}

@keyframes heart-burst {
	0% {
		background-position: left
	}
	100% {
		background-position: right
	}
}
</style>