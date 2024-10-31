<template>
  <button
    @click="getHistory"
    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:ring my-2"
  >
    Show History
  </button>
  <div class="p-4 sm:p-6 md:p-8 bg-gray-900 min-h-screen">
    <!-- Summary of Transactions -->
    <div
      v-if="summary.startDate"
      class="bg-gray-800 p-6 rounded-lg text-gray-300 space-y-4"
    >
      <div class="flex flex-col sm:flex-row justify-between items-center">
        <p class="text-lg sm:text-xl font-semibold">
          Start Date: {{ summary.startDate }}
        </p>
        <p class="text-lg sm:text-xl font-semibold">
          End Date: {{ summary.endDate }}
        </p>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-center mt-4">
        <p class="text-lg sm:text-xl font-semibold">
          Total Transactions Amount:
          <span
            :class="visibiltyClasses[isContentVisable ? 'visible' : 'blurred']"
          >
            {{ summary.totalAmount }}
          </span>
        </p>
        <button
          class="mt-2 sm:mt-0 bg-gray-600 text-white px-4 py-2 rounded hover:bg-blue-500 focus:ring focus:ring-blue-300"
          @click.prevent="isContentVisable = !isContentVisable"
        >
          Show/Hide
        </button>
      </div>

      <div
        class="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0"
      >
        <select
          v-model="selectedTransaction"
          class="text-lg sm:text-xl text-gray-100 bg-gray-700 p-2 rounded-md w-full sm:w-auto"
        >
          <option v-for="(action, index) in actions" :key="index">
            {{ action }}
          </option>
        </select>

        <!-- Total Element -->
        <div class="text-center sm:text-right mt-4 sm:mt-0">
          <p class="text-lg sm:text-2xl text-white font-semibold">Subtotal</p>
          <p
            :class="visibiltyClasses[isContentVisable ? 'visible' : 'blurred']"
          >
            {{ subTotal }}
          </p>
        </div>
      </div>
    </div>

    <!-- Transactions Table -->
    <div v-if="transactions.length" class="mt-8 overflow-x-auto">
      <table class="min-w-full bg-gray-800 text-gray-300 rounded-lg">
        <thead>
          <tr class="bg-gray-900 text-left">
            <th class="px-4 sm:px-6 py-3">Date</th>
            <th class="px-4 sm:px-6 py-3">Symbol</th>
            <th class="px-4 sm:px-6 py-3">Description</th>
            <th class="px-4 sm:px-6 py-3">Quantity</th>
            <th class="px-4 sm:px-6 py-3">Price</th>
            <th class="px-4 sm:px-6 py-3">Amount</th>
            <th class="px-4 sm:px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in filteredTransactions"
            :key="index"
            class="border-b border-gray-700"
          >
            <td class="px-4 sm:px-6 py-4">{{ row.Date || '-' }}</td>
            <td class="px-4 sm:px-6 py-4">{{ row.Symbol || '-' }}</td>
            <td class="px-4 sm:px-6 py-4">{{ row.Description || '-' }}</td>
            <td class="px-4 sm:px-6 py-4">{{ row.Quantity || '-' }}</td>
            <td class="px-4 sm:px-6 py-4">{{ row.Price || '-' }}</td>
            <td class="px-4 sm:px-6 py-4">{{ row.Amount || '-' }}</td>
            <td class="px-4 sm:px-6 py-4">{{ row.Action || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts" name="AccountSummary">
// Environment Variables for brokerage statements
const csJSON = import.meta.env.VITE_CS_HISTORY_DIR
const fileName = import.meta.env.VITE_CS_FILENAME

// Util import
import actions from '../utils/actions'

// State for transactions
import { ref, defineExpose, computed } from 'vue'
const transactions = ref([])
const summary = ref({
  startDate: '',
  endDate: '',
  totalAmount: 0,
})
const selectedTransaction = ref()
const isContentVisable = ref()

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

// Maps filteredTransactions and sums the amount
const priceFactory = (data: { Amount: string }[]) => {
  return data.map(transaction => transaction.Amount)
}

const calculateTotal = priceArray => {
  const convertAmountStingToNum = amount => {
    const newFloat = parseFloat(amount.replace(/[^0-9.-]+/g, ''))
    return newFloat
  }

  //reduce the price array to get running total
  return priceArray.reduce((total, amount) => {
    return total + convertAmountStingToNum(amount)
  }, 0)
}

interface Transaction {
  Date: string
  Symbol: string
  Description: string
  Quantity: string
  Price: string
  Amount: string
  Action: string
}

// Create Filterd Transction Logic
const filteredTransactions = computed<Transaction[]>(() => {
  if (!selectedTransaction.value) {
    return transactions.value
  } else {
    const results = transactions.value.filter(
      transaction => transaction.Action === selectedTransaction.value,
    )

    return results
  }
})

// Subtotal formatter: Rounds to the nearest hundredth and adds commas if >$1k
const totalFormatter = number => {
  if (!number || number === 0 || isNaN(number)) {
    return '$0.00'
  } else {
    // Preserve the sign of the number
    const isNegative = number < 0
    const absoluteNumber = Math.abs(number) // Work with absolute value for formatting

    const formattedNumber = absoluteNumber
      .toFixed(2) // Round to two decimal places
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') // Add commas for thousands

    // Add back the negative sign if applicable and return with '$' sign
    return `${isNegative ? '-' : ''}$${formattedNumber}`
  }
}

const subTotal = computed(() => {
  const amounts = priceFactory(filteredTransactions.value)
  const total = calculateTotal(amounts)
  console.log(`total: ${total}`)
  console.log(`Total Formatter 3000: ${totalFormatter(total)}`)
  const formatted = totalFormatter(total)
  return formatted
})

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
