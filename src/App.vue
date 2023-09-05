<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: "App",
};
</script>

<style>
#app{
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

button {
    border-radius: 60px;
    padding: 10px 20px;
    background-color: blue;
    color: #fff;
    border: black;
    cursor: pointer;
    width: auto;
    margin-left: 10px;
    margin-right: 10px;
}

button:hover {
    background-color: darkblue;
  }

input[type="text"],
input[type="password"],
input[type="email"],
input[type="number"]{
    appearance: none;
    box-sizing: border-box;
    padding: 10px 15px;
    border-radius: 60px;
    font-weight: 100;
    letter-spacing: 0.01em;
    position: relative;
    z-index: 1;
}

header{
  display: flex;
  justify-content: flex-end;
  margin-left: 10px;
}

.user-list-container {
  position: absolute;
  top: 51px; /* Adjust the top distance as needed */
  right: 10px; /* Adjust the right distance as needed */
  background-color: #fff; /* Background color of the user list */
  border: 1px solid #ddd; /* Border style */
  border-radius: 60px;
  padding: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); /* Add shadow effect */
  overflow-y: auto; /* Enable vertical scrolling if the list overflows */
}

.user-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.user-list li {
  margin-bottom: 5px;
}
</style>
