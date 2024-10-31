<template>
  <main class="p-20 bg-slate-400 my-10">
    <nav class="flex justify-between">
      <div class="flex items-center">
        <router-link to="/homee">Home Test</router-link>
        <router-link to="/options">Options Tracker</router-link>
        <router-link to="/account">Account Summary</router-link>
        <p>About</p>
      </div>
    </nav>
    <div class="justify-center flex-col">
      <h1 class="text-3xl font-bold text-gray-200 mb-4">
        iBroke Brokerage Tracker
      </h1>

      <router-view></router-view>

      <!-- <options-tracker></options-tracker> -->
    </div>

    <!-- <account-summary ref="childRef"></account-summary> -->
  </main>
</template>

<script lang="ts">
import { ref } from 'vue'

export default {
  setup() {
    const childRef = ref(null)
    const getHistory = () => {
      if (childRef.value) {
        childRef.value.getHistory()
      }
    }
    return {
      childRef,
      getHistory,
    }
  },
}
</script>
