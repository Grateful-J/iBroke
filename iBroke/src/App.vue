<template>
  <main class="p-20 bg-slate-400 my-10">
    <nav class="flex justify-between">
      <div
        class="flex items-center text-xl border text-blue-800 border-gray-300 hover:text-green-800"
      >
        <router-link to="/" class="text-blue-200">Home </router-link>
        <router-link to="options" class="text-blue-200"
          >Options Tracker</router-link
        >
        <router-link to="account" class="text-blue-200"
          >Account Summary</router-link
        >
        <p>About</p>
      </div>
    </nav>
    <div class="justify-center flex-col">
      <h1 class="text-3xl font-bold text-gray-200 mb-4">
        iBroke Brokerage Tracker
      </h1>
      <router-view></router-view>
    </div>
  </main>
</template>

<script lang="ts">
//import { ref } from 'vue'

export default {}
</script>
