<template>
  <div>
    <header>
      <button id="loginButton" @click="navigateToLoginPage">Login</button>
      <button id="registerButton" @click="navigateToRegistrationPage">Registration</button>
      <button id="cabinetButton" @click="navigateToCabinetPage">Profile</button>
      <button id="privateMesssage" @click="navigateToPrivateMesssage">Messages</button>
      <button id="groups" @click="navigateToGroups">Groups</button>
      <button id="userList" @click="getUserList">User List</button>
      <button id="notification" @click="getNotificatons">Notifications</button>
      <button id="logoutButton" @click="logout">Logout</button>
    </header>
    <main>
      <div class="user-list-container" id="user-list-container">
        <ul class="user-list">
          <template v-for="user in UserList" v-bind:key="user.ID">
            <li>
              <p @click="navigateToUserPage(user.user_uuid)">Username: {{ user.Nickname }} Status: {{ user.activity }}</p>
              <button id="followUser" @click="followUser(user.user_uuid, getCookieValue())">Follow</button>
            </li>
          </template>
        </ul>
      </div>
      <div class="notifiction-list-container" id="notifiction-list-container">
        <ul class="notifiction-list">
          <template v-for="notifications in Notifications" v-bind:key="notifications.ID">
            <li>
              <p>Message: {{ notifications.Message }}</p>
              <div v-if="notifications.Type == 'group'">
                <button @click="addToGroup(notifications.Information); deleteNotification(notifications.ID);">Accept</button>
                <button @click="deleteNotification(notifications.ID)">Decline</button>
              </div>
              <div v-if="notifications.Type == 'follow'">
                <button @click="followUser(getCookieValue(), notifications.Information); deleteNotification(notifications.ID);">Accept</button>
                <button @click="deleteNotification(notifications.ID)">Decline</button>
              </div>
            </li>
          </template>
        </ul>
      </div>
      <div id="post-creation">
        <h2>Create a Post</h2>
        <form @submit.prevent="sendpost">
          <label for="post-title">Title:</label>
          <input type="text" id="post-title"  v-model="Title" required>
                
          <label for="post-content">Content:</label>
          <textarea id="post-content"  v-model="Content" required></textarea>
                
          <label for="post-category">Category:</label>
          <select id="post-category" v-model="Category" required>
            <option value="general">General</option>
            <option value="news">News</option>
            <option value="discussion">Discussion</option>
          </select>

          <label for="post-privacy">Privacy:</label>
          <select id="post-category" v-model="Privacy" required>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="almost_private">Almost Private</option>
          </select>

          <label for="post-image">Image/GIF:</label>
          <input type="file" accept="image/*" @change="selectImage" />

          <button type="submit">Create Post</button>
        </form>
      </div>
        
      <div id="post-feed">
        <h2>Post Feed</h2>
        <template v-for="post in Posts" v-bind:key="post.ID">
          <ul class="post-list" v-if="post != null">
            <h3>{{post.Title}}</h3>
            <p>{{post.Content}}</p>
            <img :src="post.ImagePath" v-if="post.ImagePath != ''">
            <p>Category: {{post.Category}}</p>
            <p>Author: {{post.Nickname}}</p>
            <div v-if="getCookie() != ''" class="comment-section">
              <input type="text" :id="'comment-input-'+post.ID" :name="'comment-input-'+post.ID" placeholder="Enter your comment">
              <button @click="sendcomment(post.ID)">Add Comment</button>
            </div>
            <template v-for="comments in post.Comments" v-bind:key="comments.ID">
              <ul class="comment-list" :id="'comment-list-'+post.ID" v-if="comments != null">
                <li>
                  <p>{{comments.Content}}</p>
                  <div class="comment-meta">
                    <span>Author: {{comments.Nickname}}</span>
                  </div>
                </li>
              </ul>
            </template>
          </ul>
        </template>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
      return {
        Title: "",
        Content: "",
        Category: "",
        Privacy:"",
        selectedImage: null,
        Posts:[],
        UserList:[],
        Notifications:[],
        disabled:false,
        followed:false,
      };
    },
  mounted() {
    this.$socket.onopen = () => {
      this.getPosts()
      if (getCookie()){
        const addUser = {
          type: "addUserToConnection",
          uuid: getCookieValue(),
        };
        this.$socket.send(JSON.stringify(addUser))
      }
    }
    document.getElementById("user-list-container").style.display = "none";
    if (!getCookie()){
      document.getElementById("loginButton").style.display = "block";
      document.getElementById("registerButton").style.display = "block";
      document.getElementById("logoutButton").style.display = "none";
      document.getElementById("cabinetButton").style.display = "none";
      document.getElementById("post-creation").style.display = "none";
      document.getElementById("privateMesssage").style.display = "none";
      document.getElementById("userList").style.display = "none";
      document.getElementById("notification").style.display = "none";
      document.getElementById("groups").style.display = "none";
    }
    else{
      document.getElementById("loginButton").style.display = "none";
      document.getElementById("registerButton").style.display = "none";
      document.getElementById("logoutButton").style.display = "block";
      document.getElementById("cabinetButton").style.display = "block";
      document.getElementById("post-creation").style.display = "block";
      document.getElementById("privateMesssage").style.display = "block";
      document.getElementById("userList").style.display = "block";
      document.getElementById("notification").style.display = "block";
      document.getElementById("groups").style.display = "block";
    }
    this.$socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (!getCookie()){
          document.cookie = "userID=" + data.uuid + "; max-age=86400; path=/";
        }

      } catch (error) {
        console.error('No UUID for cookie', error);
      }
      this.getPosts()
    }
  },
  methods: {
    navigateToLoginPage() {
      this.$router.push('/login');
    },
    navigateToRegistrationPage() {
      this.$router.push('/register'); 
    },
    navigateToCabinetPage() {
      this.$router.push('/cabinet');
    },
    navigateToPrivateMesssage() {
      this.$router.push('/messages'); 
    },
    navigateToUserPage(user_id){
      const userData = {
          type: "cabinet",
          uuid: user_id,
        };
      this.$socket.send(JSON.stringify(userData))
      this.$router.push('/userpage');
    },
    navigateToGroups(){
      this.$router.push('/groups'); 
    },
    logout() {
      document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      this.$router.push('/login'); 
    },
    selectImage(event) {
      this.selectedImage = event.target.files[0];
    },
    async sendpost() {
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
      const postData = {
          type: "post",
          UserID: getCookieValue(),
          Title: this.Title,
          Content: this.Content,
          Category: this.Category,
          Privacy: this.Privacy,
          ImagePath: imagePath,
        };
      this.$socket.send(JSON.stringify(postData))
      this.getPosts()
      this.$router.push('/');
    },
    sendcomment(title){
      if (title != ""){
        const commentData = {
          type: "comment", 
          UserID: getCookieValue(), 
          Content: document.getElementById(`comment-input-${title}`).value, 
          PostID: title
        };
        this.$socket.send(JSON.stringify(commentData))
        this.getPosts()
        this.$router.push('/');
      }
      else{
        alert("Comment is empty");
      }
    },
    getUserList() {
      if (document.getElementById("user-list-container").style.display == "block"){
        document.getElementById("user-list-container").style.display = "none";
      }
      else{
        const userListRequest = {
          type: "userlist",
          UUID: getCookieValue(),
        };
        this.$socket.send(JSON.stringify(userListRequest));
        this.$socket.onmessage = (event) => {
          document.getElementById("notifiction-list-container").style.display = "none";
          document.getElementById("user-list-container").style.display = "block";
          const userList = JSON.parse(event.data);
          this.UserList = userList;
        }
      }
    },
    getNotificatons(){
      if (document.getElementById("notifiction-list-container").style.display == "block"){
        document.getElementById("notifiction-list-container").style.display = "none";
      }
      else{
        const notificationListRequest = {
          type: "notificationlist",
          UUID: getCookieValue(),
        };
        this.$socket.send(JSON.stringify(notificationListRequest));
        this.$socket.onmessage = (event) => {
          document.getElementById("user-list-container").style.display = "none";
          document.getElementById("notifiction-list-container").style.display = "block";
          const notificationList = JSON.parse(event.data);
          this.Notifications = notificationList;
        }
      }
    },
    getPosts(){
      const postsJSON = {
        type: "posts",
        UUID: getCookieValue(),
      };
      this.$socket.send(JSON.stringify(postsJSON))
      this.$socket.onmessage = (event) =>{
        const postList = JSON.parse(event.data);
        this.Posts = postList
      }
    },
    followUser(userid, followinguser){
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
        user_uuid: followinguser,
      };
      this.$socket.send(JSON.stringify(followUser))
      this.$router.push('/');
    },
    addToGroup(groupName){
      const addToGroup = {
        type: "addToGroup",
        Name: groupName,
        Description: getCookieValue(),
      };
      this.$socket.send(JSON.stringify(addToGroup))
      this.$router.push('/');
    },
    deleteNotification(id){
      const deleteNotification = {
        type: "deleteNotification",
        ID: id,
      };
      this.$socket.send(JSON.stringify(deleteNotification))
      this.$router.push('/');
    },
    getCookie() {
      const cookies = document.cookie.split("; ");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split("=");
        if (cookie[0] === "userID") {
            return cookie[1];
        }
      }
    return "";
    }
  },
};


function getCookie() {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split("=");
        if (cookie[0] === "userID") {
            return cookie[1];
        }
    }
    return "";
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
main {
    padding: 20px;
}
input[type="text"]{
    appearance: none;
    box-sizing: border-box;
    padding: 10px 15px;
    border-radius: 60px;
    font-weight: 100;
    letter-spacing: 0.01em;
    position: relative;
    z-index: 1;
}
textarea{
    padding: 3px 15px;
    border-radius: 60px;
    font-weight: 100;
    letter-spacing: 0.01em;
    position: relative;
    resize:none;
    z-index: 1;
    vertical-align: middle;
    border-width: 2px;
}
select{
    appearance: none;
    box-sizing: border-box;
    padding: 10px 15px;
    border-radius: 60px;
    font-weight: 100;
    letter-spacing: 0.01em;
    position: relative;
    z-index: 1;
    border-width: 2px;
}
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
.forum-link:hover {
    cursor: pointer;
}
.comment-list{
    margin-top: 10px;
}
</style>