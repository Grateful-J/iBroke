<template>
  <div class="p-4 md:p-8 bg-gray-900 min-h-screen text-gray-300">
    <!-- Dropdown for selecting tickers -->
    <div class="mb-6">
      <label for="tickerSelect" class="block text-lg font-medium mb-2"
        >Select Ticker:</label
      >
      <select
        id="tickerSelect"
        v-model="selectedTicker"
        class="block w-full bg-gray-700 p-3 rounded-lg focus:ring focus:ring-blue-500"
      >
        <option disabled value="">Please select one</option>
        <option v-for="ticker in tickers" :key="ticker" :value="ticker">
          {{ ticker }}
        </option>
      </select>
    </div>

    <!-- Options Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div
        v-for="(option, index) in filteredOptions"
        :key="index"
        class="bg-gray-800 p-4 rounded-lg shadow-lg"
      >
        <h3 class="text-xl font-semibold">{{ option.type }}</h3>
        <p>
          Status:
          <span
            :class="
              option.status === 'open' ? 'text-green-400' : 'text-red-400'
            "
            >{{ option.status }}</span
          >
        </p>
        <p>Strike Price: {{ option.strike }}</p>
        <p>Expiration: {{ option.expiration }}</p>
      </div>
    </div>

    <!-- Graph Section -->
    <div v-if="showGraph">
      <button
        class="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        @click="toggleGraph"
      >
        Toggle Graph
      </button>
      <!-- Graph component goes here -->
      <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
        <!-- Placeholder for graph -->
        <p class="text-center text-lg">Graph will be displayed here.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="OptionsTracker">
import { ref } from 'vue'

console.log(`Options Tracker found`)
const demoOptions = [
  {
    type: 'Call',
    ticker: 'AAPL',
    strike: 100,
    expiration: '2022-12-31',
    status: 'open',
  },
  {
    type: 'Put',
    ticker: 'MSFT',
    strike: 110,
    expiration: '2022-12-31',
    status: 'open',
  },
]

// State for ticker selection
const selectedTicker = ref('')
const tickers = ref(demoOptions.map(option => option.ticker))
const filteredOptions = ref([])

// State for graph toggle
const showGraph = ref(false)

// Function to toggle graph visibility
const toggleGraph = () => {
  showGraph.value = !showGraph.value
}

console.log(`demoOptions: ${demoOptions[1].type}`)

/*
TODO:
1 Track Options somehow?
2 map an object of arrays?
  > one for each action
3 Keep a running total of options revenue
4 earning plays: Sell to Open, Sell to Close
5 negative plays: Buy to Close, Buy to Open
6 Track options:
  if an Open action is made, kepe track of the underlying asset
  if a Close action is made, refrence expiration date of open order and close
  * wild card: assigned or expired
  if assigned (negative price action but also a later TODO: would count as a track sell (Put) or buy (Call))
  if expired (positive action)
  * note* but doesnt affect pricing> roll an option
7 Create a live view of Open Options
8 Show perforamnce metrics and suggestions for exit strategy based on risk toelrance
9 TODO: create a Tax window:
  > ????
   brain is dead

10





 */
</script>
