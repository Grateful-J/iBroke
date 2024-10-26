<template>
  <div>
    <!-- Summary of Transactions -->
    <div
      v-if="summary.startDate"
      class="mt-6 bg-gray-800 p-4 rounded-lg text-gray-300"
    >
      <p class="text-xl">Start Date: {{ summary.startDate }}</p>
      <p class="text-xl">End Date: {{ summary.endDate }}</p>
      <span>
        <p class="text-xl">
          Total Transactions Amount:
          <span>
            <p
              :class="
                visibiltyClasses[isContentVisable ? 'visible' : 'blurred']
              "
            >
              {{ summary.totalAmount }}
            </p>
          </span>
        </p>
        <button
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-blue-200 focus:ring my-2"
          @click.prevent="
            isContentVisable
              ? (isContentVisable = false)
              : (isContentVisable = true)
          "
        >
          Show/Hide
        </button>
      </span>

      <div class="flex col justify-between">
        <select
          v-model="selectedTransaction"
          class="text-xl text-gray-100 bg-slate-600"
        >
          <option v-for="(action, index) in actions" :key="index">
            {{ action }}
          </option>
        </select>

        <!-- Total Element-->
        <div class="px-32">
          <span>
            <h2 class="text-2xl text-white">Subtotal</h2>
          </span>
          <span>
            <h2 :subTotal>{{ subTotal.value }}</h2>
          </span>
        </div>
      </div>
    </div>

    <!-- Total Element-->
    <div>
      <span>
        <p class="text-2xl text-white">Subtotal</p>
      </span>
    </div>
  </div>

  <!-- Transactions Table -->
  <div v-if="transactions.length" class="mt-4 overflow-x-auto">
    <table class="min-w-full bg-gray-800 text-gray-300">
      <thead>
        <tr class="bg-gray-900 text-left">
          <th class="px-6 py-3">Date</th>
          <th class="px-6 py-3">Symbol</th>
          <th class="px-6 py-3">Description</th>
          <th class="px-6 py-3">Quantity</th>
          <th class="px-6 py-3">Price</th>
          <th class="px-6 py-3">Amount</th>
          <th class="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in filteredTransactions"
          :key="index"
          class="border-b border-gray-700"
        >
          <td class="px-6 py-4">{{ row.Date }}</td>
          <td class="px-6 py-4">{{ row.Symbol }}</td>
          <td class="px-6 py-4">{{ row.Description }}</td>
          <td class="px-6 py-4">{{ row.Quantity }}</td>
          <td class="px-6 py-4">{{ row.Price }}</td>
          <td class="px-6 py-4">{{ row.Amount }}</td>
          <td class="px-6 py-4">{{ row.Action }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts" name="AccountSummary">
// Environment Variables for brokerage statements
const csJSON = import.meta.env.VITE_CS_HISTORY_DIR
const fileName = import.meta.env.VITE_CS_FILENAME

// State for transactions
import { ref, defineExpose, computed } from 'vue'
const transactions = ref([])
const summary = ref({
  startDate: '',
  endDate: '',
  totalAmount: 0,
})
const selectedTransaction = ref()

console.log(`option selected: ${selectedTransaction.value}`)

// Fetch JSON data
const getHistoryFile = async () => {
  try {
    const response = await fetch(`${csJSON}/${fileName}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to load history:', error)
  }
}

// Handle fetching and populating history data
const getHistory = async () => {
  const dump = await getHistoryFile()

  if (!dump) return

  summary.value = {
    startDate: dump.FromDate,
    endDate: dump.ToDate,
    totalAmount: dump.TotalTransactionsAmount,
  }

  transactions.value = dump.BrokerageTransactions
}

defineExpose({ getHistory })

// Predefined types of actions
const actions = [
  'Cash Dividend',
  'Buy to Close',
  'Buy',
  'Sell',
  'Sell to Open',
  'Sell to Close',
  'Buy to Open',
  'Credit Interest',
  'MoneyLink Transfer',
  'Expired',
  'Assigned',
  'Reinvest Shares',
  'Reinvest Dividend',
]

let subTotal = 0

// Maps filteredTransactions and sums the amount
const priceFactory = data => {
  return data.map(transaction => transaction.Amount)
}
/* const filteredAmounts = data => {
  const prices = priceFactory(data)
  //console.log(`The Prices are: ${prices}`)
} */

const calculateTotal = priceArray => {
  const convertAmountStingToNum = amount => {
    const newFloat = parseFloat(amount.replace(/[^0-9,-]+/g, ''))
    console.log(`Da new Float is: ${newFloat}`)
    return newFloat
  }

  //reduce the price array to get running total
  return priceArray.reduce((total, amount) => {
    return total + convertAmountStingToNum(amount)
  }, 0)
}

// Create Filterd Transction Logic
const filteredTransactions = computed<string>(() => {
  if (!selectedTransaction.value) {
    return transactions.value
  } else {
    const results = transactions.value.filter(
      transaction => transaction.Action === selectedTransaction.value,
    )
    //console.log(`The Results: ${JSON.stringify(results)}`)

    const amounts = priceFactory(results)
    const total = calculateTotal(amounts)
    console.log(`holy shit please make this work ${total}`)
    subTotal = total

    return results
  }
})

/* const priceFactory = data => {
  return data.map(transaction => transaction.Amount)
}

// Maps filteredTransactions and sums the amount

const filteredAmounts = () => {
  const prices = priceFactory(results)
  console.log(`The Prices are: ${prices}`)
}
 */
// TODO: Add logic for user uploads, sorting, MongoDB checks, etc.

// Whiteboard-
// user inputs JSON data via upload (currently pulls from local dev server)
// sorts transactons based on actions
// if action is Sell to Open, etc then it is an ${contract}
// figure out how to organize the data and keep a running list of current options
// give options a unique id so they can be tracked and closes/ assigned/ or expired/ or rolled into a later contact
// TODO: checks mongoDB and updates any lines
// Allow user to sort by date, symbol, and/or action
// give metrics for total transactions, total fees, total amount, return on investment,
// give user an option to input estimated tax bracket to determine short term tax burden estimator
// give suggestions for tax loss harvesting

//Toggle function for sensitive data

const isContentVisable = ref()

const visibiltyClasses = {
  visible: `text-xl text-white`,
  blurred: `text-xl blur-md`,
}
</script>

<style scoped>
main {
  max-width: 1200px;
  margin: 0 auto;
  color: #e2e8f0;
  /* Light gray for readability on dark background */
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 16px;
}

th {
  background-color: #1f2937;
  text-transform: uppercase;
}

td {
  background-color: #374151;
}

button {
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #3b82f6;
}
</style>
