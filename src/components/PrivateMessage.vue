<template>
    <div>
        <header>
            <div id="buttons">
                <button id="mainButton" @click="navigateToMainPage">Main Page</button>
                <button id="cabinetButton" @click="navigateToCabinetPage">Profile</button>
                <button id="groups" @click="navigateToGroups">Groups</button>
                <button id="userList" @click="getUserList">User List</button>
                <button id="logoutButton" @click="logout">Logout</button>
            </div>
        </header>
        <body>
            <div class="chat-container">
                <h1>User List</h1>
                <div class="user-list" id="user-list-container">
                    <ul id="user-list" >
                        <template v-for="users in Users" v-bind:key="users.ID">
                            <li>
                                <a :data-status=users.activity :id="'user-'+users.Nickname" @click="showMessages(users.Nickname, users.activity)">{{users.Nickname}}</a>
                            </li>
                        </template>
                    </ul>
                </div>
                <h1>Groups</h1>
                <div class="group-list" id="group-list-container">
                    <ul id="group-list" >
                        <template v-for="group in groups" :key="group.id">
                            <li>
                                <a :id="'group-'+group.Name" @click="showGroupMessages(group.Name)">{{group.Name}}</a>
                            </li>
                        </template>
                    </ul>
                </div>
                <div id="chat-window" class="chat-window">
                <h2>Chat</h2>
                    <div id="message-list" class="message-list">
                        <template v-for="messages in Messages" v-bind:key="messages.Time">
                            <li>
                                <h3>Text {{messages.Content}}</h3>
                                <a>Time {{messages.Time}}</a>
                                <a>Name {{messages.SenderId}}</a>
                            </li>
                        </template>
                    </div>
                    <div id="messages" v-if="this.activity == 'online'">
                        <input type="text" id="message-input" placeholder="Type your message..." />
                        <button v-if="this.type == 'person'" @click="sendPrivateMessage(this.user, this.activity)">Send</button>
                        <button v-else-if="this.type == 'group'" @click="sendGroupMessage(this.user)">Send</button>
                    </div>
                </div>
            </div>
        </body>
    </div>
</template>

<script>
export default {
    data() {
      return {
        Users:[],
        Messages:[],
        current_user:"",
        activity:"offline",
        user:"",
        groups: [],
        type:"",
      };
    },
    mounted() {
        this.getUsers()
    },
    methods:{
        getUsers(){
            const userData = {
                type: "userlist",
                uuid: getCookieValue(),
            };
            this.$socket.send(JSON.stringify(userData))
            this.$socket.onmessage = (event) =>{
                const userList = JSON.parse(event.data);
                this.Users = userList
                const recivegroups = {
                    type: "get_groups",
                    Page: "messages",
                    UUID: getCookieValue(),
                };
                this.$socket.send(JSON.stringify(recivegroups))
                this.$socket.onmessage = (event) => {
                    const groupList = JSON.parse(event.data);
                    this.groups = groupList
                }
            }
        },
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
        navigateToGroups(){
            this.$router.push('/groups'); 
        },
        sendPrivateMessage(nickanme, activity){
            const message = document.getElementById(`message-input`).value;
            const userMessageData = {
                type: "sendPrivateMessage", 
                UserID: getCookieValue(), 
                Nickname: nickanme,
                Content: message,
            }
            this.$socket.send(JSON.stringify(userMessageData))
            this.showMessages(nickanme, activity)
        },
        sendGroupMessage(name){
            const message = document.getElementById(`message-input`).value;
            const userMessageData = {
                type: "sendGroupMessage", 
                UserID: getCookieValue(), 
                Nickname: name,
                Content: message,
            }
            this.$socket.send(JSON.stringify(userMessageData))
            this.showGroupMessages(name)
        },
        showMessages(name, activity){
            const userMessageData = {
                type: "showmessage", 
                UserID: getCookieValue(), 
                Nickname: name,
                Offset: 0,
            }
            this.$socket.send(JSON.stringify(userMessageData))
            this.$socket.onmessage = (event) =>{
                const messagesList = JSON.parse(event.data);
                this.Messages = messagesList
                this.Messages = this.Messages.reverse()
                this.activity = activity
                this.type = "person"
                this.user = name
            }
        },
        showGroupMessages(name){
            const userMessageData = {
                type: "showgroupmessage", 
                UserID: getCookieValue(), 
                Nickname: name,
                Offset: 0,
            }
            this.$socket.send(JSON.stringify(userMessageData))
            this.$socket.onmessage = (event) =>{
                const messagesList = JSON.parse(event.data);
                this.Messages = messagesList
                this.Messages = this.Messages.reverse()
                this.activity = 'online'
                this.type = "group"
                this.user = name
            }
        },
        getUserList() {
            const userListRequest = {
                type: "userlist",
                UUID: getCookieValue(),
            };
            this.$socket.send(JSON.stringify(userListRequest));
            this.$socket.onmessage = (event) => {
                document.getElementById("user-list-container").style.display = "block";
                const userList = JSON.parse(event.data);
                this.UserList = userList;
            }
        },
        logout() {
            document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            const logoutData = {
                type: "log_out",
                uuuid: getCookieValue(),
            };
            this.$socket.send(JSON.stringify(logoutData))
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
    .chat-container {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 20px;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .user-list h2,
    .group-list h2 {
        margin-bottom: 10px;
        color: #333;
    }
    .user-list ul,
    .group-list ul{
        list-style-type: none;
        padding: 0;
    }
    .user-list li [data-status="online"],
    .group-list li [data-status="online"]{
        display: inline-block;
        margin: 5px;
        padding: 10px 20px;
        border-radius: 30px;
        background-color: blue;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
    .user-list li [data-status=""],
    .group-list li [data-status=""]{
        display: inline-block;
        margin: 5px;
        padding: 10px 20px;
        border-radius: 30px;
        background-color: red;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
    .user-list li:hover [data-status="online"],
    .group-list li:hover [data-status="online"] {
        background-color: darkblue;
    }
    .user-list li:hover [data-status="offline"],
    .group-list li:hover [data-status="offline"]{
        background-color: darkred;
    }
    .chat-window {
        flex: 0 0 70%;
        max-width: 70%;
    }
    .chat-window h2 {
        margin-bottom: 10px;
        color: #333;
    }
    #message-list {
        max-height: 300px;
        overflow-y: scroll;
        padding: 10px;
        border: 1px solid #ccc;
        background-color: #f9f9f9;
        border-radius: 30px;
        scrollbar-color: blue;
    }
    #message-list li {
        margin-bottom: 10px;
        display:block;
    }
    #message-list h3 {
        margin: 0;
        font-size: 16px;
        font-weight: bold;
    }
    #message-list a {
        color: #333;
        text-decoration: none;
    }
    #message-form {
        margin-top: 20px;
    }
    #message-input {
        width: 80%;
        padding: 5px;
        border: 1px solid #ccc;
    }
    button {
        border-radius: 60px;
        padding: 10px 20px;
        background-color: blue;
        color: #fff;
        border: black;
        cursor: pointer;
        width: auto;
        text-align: center;
    }
    button:hover {
        background-color: darkblue;
    }
    #buttons {
        display: flex;
        justify-content: flex-end;
        margin-left: 10px;
    }
    #buttons button {
        margin-left: 10px;
    }
    .circle {
        border-radius: 50%;
        width: 10px;
        height: 10px;
        padding: 10px;
        background: #ecd60a;
        border: 3px solid #ecd60a;
        color: #ecd60a;
        text-align: center;
        font: 32px Arial, sans-serif;
    }
</style>