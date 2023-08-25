<template>
  <div>
    <header>
      <button id="loginButton" @click="navigateToLoginPage">Login</button>
      <button id="registerButton" @click="navigateToRegistrationPage">Registration</button>
      <button id="cabinetButton" @click="navigateToCabinetPage">Profile</button>
      <button id="privateMesssage" @click="navigateToPrivateMesssage">Messages</button>
      <button id="logoutButton" @click="logout">Logout</button>
    </header>
    <main>
      <div id="post-creation">
        <h2>Create a Post</h2>
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
                
        <button @click="sendpost">Create Post</button>
      </div>
        
      <div id="post-feed">
        <h2>Post Feed</h2>
        <template v-for="post in Posts" v-bind:key="post.ID">
          <ul class="post-list" v-if="post != null">
            <h3>{{post.Title}}</h3>
            <p>{{post.Content}}</p>
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
        Posts:[],
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
    if (!getCookie()){
      document.getElementById("loginButton").style.display = "block";
      document.getElementById("registerButton").style.display = "block";
      document.getElementById("logoutButton").style.display = "none";
      document.getElementById("cabinetButton").style.display = "none";
      document.getElementById("post-creation").style.display = "none";
      document.getElementById("privateMesssage").style.display = "none";
    }
    else{
      document.getElementById("loginButton").style.display = "none";
      document.getElementById("registerButton").style.display = "none";
      document.getElementById("logoutButton").style.display = "block";
      document.getElementById("cabinetButton").style.display = "block";
      document.getElementById("post-creation").style.display = "block";
      document.getElementById("privateMesssage").style.display = "block";
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
    logout() {
      document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      this.$router.push('/login'); 
    },
    sendpost() {
      const postData = {
          type: "post",
          UserID: getCookieValue(),
          Title: this.Title,
          Content: this.Content,
          Category: this.Category,
        };
      this.$socket.send(JSON.stringify(postData))
      this.getPosts()
      this.$router.push('/');
    },
    sendcomment(title){
      const commentData = {
          type: "comment", 
          UserID: getCookieValue(), 
          Content: document.getElementById(`comment-input-${title}`).value, 
          PostID: title
        };
      this.$socket.send(JSON.stringify(commentData))
      this.getPosts()
      this.$router.push('/');
    },
    getPosts(){
      const postsJSON = {
        type: "posts", 
      };
      this.$socket.send(JSON.stringify(postsJSON))
      this.$socket.onmessage = (event) =>{
        const postList = JSON.parse(event.data);
        this.Posts = postList
      }
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