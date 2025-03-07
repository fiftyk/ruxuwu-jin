<script setup lang="ts">
// 不再需要直接导入 HelloWorld 组件
</script>

<template>
  <div class="app">
    <header>
      <nav>
        <router-link to="/">首页</router-link> |
        <router-link to="/about">关于</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f5f7fa;
  min-height: 100vh;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}

main {
  padding: 20px;
}
</style>
