<template>
  <main
    :class="isDark ? 'bg-slate-900 text-gray-300' : 'bg-gray-50 text-gray-700'"
    class="font-sans transition-colors duration-500 ease-in-out"
  >
    <nav class="flex justify-between items-center p-4 md:px-10 lg:px-20">
      <div class="flex space-x-4">
        <router-link
          v-for="link in navLinks"
          :key="link.name"
          :to="link.route"
          class="text-base md:text-lg font-medium tracking-wide hover:text-green-500 transition-colors"
          :class="isDark ? 'hover:text-green-400' : 'hover:text-blue-500'"
        >
          {{ link.name }}
        </router-link>
      </div>
      <button
        @click="toggleTheme"
        class="p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 ring-offset-2"
        :class="
          isDark
            ? 'bg-gray-800 hover:bg-gray-700'
            : 'bg-white hover:bg-gray-200'
        "
      >
        <span :class="isDark ? 'pi-moon' : 'pi-sun'" class="pi text-xl"></span>
      </button>
    </nav>
    <div class="flex flex-col items-center mt-10">
      <h1 class="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
        iBroke Brokerage Tracker
      </h1>
      <div id="app-view" class="w-full mt-4">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isDark = ref(false)
const toggleTheme = () => {
  isDark.value = !isDark.value
}

const navLinks = ref([
  { name: 'Home', route: '/' },
  { name: 'Options Tracker', route: '/options' },
  { name: 'Account Summary', route: '/account' },
  { name: 'About', route: '/about' },
])
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
