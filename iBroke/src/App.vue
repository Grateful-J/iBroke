<template>
  <main class="p-20 bg-slate-400 my-10">
    <div class="justify-center flex-col">
      <h1 class="text-3xl font-bold text-gray-200 mb-4">
        iBroke Brokerage Tracker
      </h1>

      <button
        @click="getHistory"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:ring my-2"
      >
        Show History
      </button>
    </div>

    <account-summary ref="childRef"></account-summary>
  </main>
</template>

<script lang="ts">
import AccountSummary from './views/AccountSummary.vue'
import { ref } from 'vue'

export default {
  components: {
    AccountSummary,
  },
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
