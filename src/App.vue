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
</style>
