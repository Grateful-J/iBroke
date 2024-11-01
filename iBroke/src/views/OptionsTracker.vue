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
        @change="console.log(filteredOptions.length)"
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
        <h4
          class="text-lg font-medium"
          :class="
            option.action === 'Sell to Open' ||
            option.action === 'Sell to Close'
              ? 'text-green-400'
              : 'text-red-400'
          "
        >
          {{ option.action }}
        </h4>
        <p>
          Status:
          <span
            :class="
              option.status === 'open' ? 'text-green-400' : 'text-red-400'
            "
            >{{ option.status }}</span
          >
        </p>
        <p>Strike Price: ${{ option.strike }}</p>
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
import { ref, computed } from 'vue'

// Demo data Generator
const demoOptions = [
  // Repeated and varied entries to fill up to 100 items
  ...Array(100)
    .fill()
    .map((_, index) => ({
      type: ['Call', 'Put'][Math.floor(Math.random() * 2)],
      action: ['Buy to Close', 'Sell to Open', 'Buy to Open', 'Sell to Close'][
        Math.floor(Math.random() * 4)
      ],
      ticker: ['AAPL', 'MSFT', 'GOOG', 'TSLA', 'AMZN', 'NVDA'][
        Math.floor(Math.random() * 6)
      ],
      strike: Math.floor(Math.random() * 300) + 100, // Random strike price from 100 to 400
      expiration: `202${Math.floor(index / 33) + 3}-${Math.floor(
        Math.random() * 12 + 1,
      )
        .toString()
        .padStart(2, '0')}-${Math.floor(Math.random() * 28 + 1)
        .toString()
        .padStart(2, '0')}`, // Expiration dates from 2023 to 2025
      status: ['open', 'closed', 'expired'][Math.floor(Math.random() * 3)],
    })),
]

// Example Options Data
interface Option {
  date: string
  action: string
  ticker: string
  expDate: string
  strike: string
  type: string
  longName: string
  description: string
  quantity: string
  price: string
  feesAndComm: string
  amount: string
}

const dummyOptions: Option[] = [
  {
    date: '10/18/2024',
    action: 'Buy to Close',
    ticker: 'RKLB',
    expDate: '10/25/2024',
    strike: '9.5',
    type: 'PUT',
    longName: 'PUT ROCKET LAB USA INC',
    description: 'PUT ROCKET LAB USA INC $9.5 EXP 10/25/24',
    quantity: '4',
    price: '$0.10',
    feesAndComm: '$2.64',
    amount: '-$42.64',
  },
  {
    date: '10/18/2024',
    action: 'Sell to Open',
    ticker: 'HIMS',
    expDate: '11/01/2024',
    strike: '25',
    type: 'CALL',
    longName: 'CALL HIMS & HERS HEALTH',
    description: 'CALL HIMS & HERS HEALTH $25 EXP 11/01/24',
    quantity: '1',
    price: '$0.20',
    feesAndComm: '$0.66',
    amount: '$19.34',
  },
]

const rawData = [
  {
    Date: '09/23/2024',
    Action: 'Sell to Open',
    Symbol: 'NVDA 10/04/2024 115.00 P',
    Description: 'PUT NVIDIA CORP $115 EXP 10/04/24',
    Quantity: '1',
    Price: '$3.40',
    'Fees & Comm': '$0.67',
    Amount: '$339.33',
  },
  {
    Date: '09/23/2024',
    Action: 'Sell to Open',
    Symbol: 'ASTS 09/27/2024 25.00 P',
    Description: 'PUT AST SPACEMOBILE INC $25 EXP 09/27/24',
    Quantity: '4',
    Price: '$0.75',
    'Fees & Comm': '$2.66',
    Amount: '$297.34',
  },
  {
    Date: '09/23/2024',
    Action: 'Sell to Open',
    Symbol: 'ASTS 10/04/2024 30.00 C',
    Description: 'CALL AST SPACEMOBILE INC$30 EXP 10/04/24',
    Quantity: '1',
    Price: '$1.20',
    'Fees & Comm': '$0.66',
    Amount: '$119.34',
  },
  {
    Date: '09/23/2024',
    Action: 'Buy to Close',
    Symbol: 'SVIX 10/18/2024 23.00 P',
    Description: 'PUT 1X SHRT VIX FUTRS $23 EXP 10/18/24',
    Quantity: '2',
    Price: '$0.50',
    'Fees & Comm': '$1.32',
    Amount: '-$101.32',
  },
]
function parseData(rawData: any[]): Option[] {
  return rawData.map(item => {
    const symbolDetails = item.Symbol.split(' ')
    const ticker = symbolDetails[0]
    const expDate = symbolDetails[1]
    const strike = symbolDetails[2]
    const type = symbolDetails[3] === 'P' ? 'PUT' : 'CALL'
    const longName = item.Description.split(' $')[0] || ''

    return {
      date: item.Date,
      action: item.Action,
      ticker: ticker,
      expDate: expDate,
      strike: strike,
      type: type,
      longName: longName,
      description: item.Description,
      quantity: item.Quantity,
      price: item.Price,
      feesAndComm: item['Fees & Comm'], // Accessing using bracket notation due to special characters & whitespace
      amount: item.Amount,
    }
  })
}

const parsedOptions = ref(parseData(rawData))

const optionsTest = computed(() => {
  return parsedOptions.value
})

console.log(optionsTest.value)

console.log(`dummy dummy ${rawData[0].Symbol}`)

// State for ticker selection
const selectedTicker = ref('')
const tickers = computed(() => {
  return demoOptions
    .map(option => option.ticker)
    .filter((ticker, index, self) => self.indexOf(ticker) === index)
})
const filteredOptions = computed(() => {
  return demoOptions.filter(option => option.ticker === selectedTicker.value)
})

// State for graph toggle
const showGraph = ref(true)

// Function to toggle graph visibility
const toggleGraph = () => {
  if (showGraph.value) {
    console.log('Graph will be displayed')
  } else {
    console.log('Graph will be hidden')
  }
}

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
