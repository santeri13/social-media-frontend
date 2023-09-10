<template>
    <div>
        <header>
            <button id="mainButton" @click="navigateToMainPage">Main Page</button>
            <button id="cabinetButton" @click="navigateToCabinetPage">Profile</button>
            <button id="privateMesssage" @click="navigateToPrivateMesssage">Messages</button>
            <button id="userList" @click="getUserList">User List</button>
            <button id="logoutButton" @click="logout">Logout</button>
        </header>
        <main>
            <div>
                <h2>Create a New Group</h2>
                <form @submit.prevent="createGroup">
                    <label for="groupName">Group Name:</label>
                    <input type="text" id="groupName" v-model="groupName" required>
                    <label for="description">Description:</label>
                    <input type="text" id="description" v-model="description">
                    <button type="submit">Create Group</button>
                </form>
            </div>
            <div>
                <h2>Groups</h2>
                <ul>
                    <li v-for="group in groups" :key="group.id">
                        {{ group.Name }}
                        {{ group.Description }}
                    </li>
                </ul>
            </div>
        </main>
    </div>
</template>

<script>
export default {
    data() {
        return {
            groupName: '',
            description:'',
            groups: [],
        };
    },
    mounted() {
        const recivegroups = {
            type: "get_groups",
            Page: "group",
            UUID: getCookieValue(),
        };
        this.$socket.send(JSON.stringify(recivegroups))
        this.$socket.onmessage = (event) => {
            const groupList = JSON.parse(event.data);
            this.groups = groupList
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
        createGroup() {
            const groupInformation = {
                type: "createGroup",
                UUID: getCookieValue(),
                Name: this.groupName,
                Description: this.description,
            };
            this.$socket.send(JSON.stringify(groupInformation));
            this.$router.push('/groups'); 
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