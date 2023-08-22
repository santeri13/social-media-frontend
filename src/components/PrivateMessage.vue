<template>
    <div>
        <header>
            <div id="buttons">
                <button id="mainButton" @click="navigateToMainPage">Main Page</button>
                <button id="cabinetButton" @click="navigateToCabinetPage">Profile</button>
                <button id="logoutButton" @click="logout">Logout</button>
            </div>
        </header>
        <body>
            <div class="chat-container">
                <div class="user-list" id="user-list-container">
                    <ul id="user-list" >
                        <!-- User list will be populated dynamically -->
                    </ul>
                </div>
                <div id="chat-window" class="chat-window">
                <h2>Chat</h2>
                    <div id="message-list" class="message-list">
                        <!-- Message list will be populated dynamically -->
                    </div>
                </div>
            </div>
        </body>
    </div>
</template>

<script>
export default {
    methods:{
        navigateToMainPage() {
            this.$router.push('/');
        },
        navigateToCabinetPage() {
            this.$router.push('/cabinet'); 
        },
        logout() {
            document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            this.$router.push('/'); 
        },
    },
};
</script>