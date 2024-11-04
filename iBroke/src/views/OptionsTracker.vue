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
        @change="calculateTotal(filteredOptions.map(option => option.amount))"
        class="block w-full bg-gray-700 p-3 rounded-lg focus:ring focus:ring-blue-500"
      >
        <option disabled value="">Please select one</option>
        <option v-for="ticker in tickers" :key="ticker" :value="ticker">
          {{ ticker }}
        </option>
      </select>

      <!-- JSON picker -->

      <div class="mt-4">
        <label for="fileItem" class="block text-lg font-medium mb-2 mt-4"
          >Select JSON file:</label
        >
        <!--         <input id="fileItem" type="file" />
        <button
          @click="uploadFile"
          class="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 transition-all duration-300 ease-in-out"
        >
          Upload
        </button> -->

        <FileUpload
          name="demo[]"
          url="/options"
          @upload.prevent="uploadFile"
          :multiple="true"
          accept="application/json"
          :maxFileSize="1000000"
          id="fileInput"
        >
          <template #empty>
            <div
              class="flex flex-col items-center justify-center h-full border-white border-2"
            >
              <span class="text-gray-400 m-6"
                >Drag and drop files to here to upload.</span
              >
            </div>
          </template>
        </FileUpload>
      </div>
      <div class="card flex justify-center">
        <Toast />
        <div class="flex flex-wrap gap-2">
          <Button label="Success" severity="success" @click="showSuccess">
            Sucess</Button
          >
          <Button label="Info" severity="info" @click="showInfo" />
          <Button label="Warn" severity="warn" @click="showWarn" />
          <Button label="Error" severity="danger" @click="showError" />
          <Button
            label="Secondary"
            severity="secondary"
            @click="showSecondary"
          />
          <Button label="Contrast" severity="contrast" @click="showContrast" />
        </div>
      </div>

      <div class="text-center sm:text-right mt-4 sm:mt-0">
        <p class="text-lg sm:text-2xl text-white font-semibold">Subtotal</p>
        <p class="font-bold text-xl">{{ totalFormatter(totalAmount) }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div
        v-for="(option, index) in filteredOptions"
        :key="index"
        class="bg-gray-800 p-4 rounded-lg shadow-lg transform transition-all hover:scale-105 cursor-pointer"
        @click="option.expanded = !option.expanded"
      >
        <!-- Reduced Card View -->
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-xl font-semibold">{{ option.type }}</h3>
            <h4
              class="text-lg"
              :class="
                option.action.includes('Sell')
                  ? 'text-green-400'
                  : 'text-red-400'
              "
            >
              {{ option.action }}
            </h4>
          </div>
          <p
            class="text-2xl font-bold"
            :class="
              option.amount < 0 ? 'text-red-400' : 'text-green-400'
              //option.status ? 'text-green-400' : 'text-red-400'
            "
          >
            {{ option.amount }}
          </p>
        </div>

        <!-- Expandable Details Section -->
        <div v-if="option.expanded" class="mt-4 space-y-2">
          <p>Description: {{ option.description }}</p>
          <p>Strike Price: ${{ option.strike }}</p>
          <p>Expiration: {{ option.expDate }}</p>
          <p>Quantity: {{ option.quantity }}</p>
          <p>Price: {{ option.price }}</p>
          <p>Fees & Comm: {{ option.feesAndComm }}</p>

          <p
            class="text-sm font-bold"
            :class="option.status ? 'text-green-400' : 'text-red-400'"
          >
            {{ option.status ? 'Status: Active' : 'Status: Expired' }}
          </p>
        </div>
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
import { ref, onMounted, computed } from 'vue'

// Example Options Data
interface Option {
  date: string
  action: string
  ticker: string
  expDate: string
  strike: number
  type: string
  longName: string
  description: string
  quantity: number
  price: number
  feesAndComm: number
  amount: number
  expanded: boolean
  status: boolean
}

// Environment Variables for brokerage statements
const csJSON = import.meta.env.VITE_CS_HISTORY_DIR
const fileName = import.meta.env.VITE_CS_FILENAME

const parsedOptions = ref<Option[]>([]) // State for options data

const selectedJSON = ref('') // State for selected JSON file
const JSONs = ref([]) // State for available JSON files

import FileUpload from 'primevue/fileupload'

// Function to upload JSON file
const uploadFile = () => {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement
  const file = fileInput.files?.[0]
  if (file) {
    selectedJSON.value = file.name
    const reader = new FileReader()
    reader.onload = () => {
      const data = reader.result
      if (data) {
        JSONs.value = JSON.parse(data.toString())
        const optionData = JSONs.value.BrokerageTransactions.filter(
          (item: any) =>
            [
              'Buy to Close',
              'Sell to Open',
              'Sell to Close',
              'Buy to Open',
            ].includes(item.Action),
        )
        parsedOptions.value = parseData(optionData)
      }
    }
    reader.readAsText(file)
  } else {
    console.error('No file selected')
  }
}

// Fetch and process JSON data
const fetchOptionsData = async () => {
  try {
    const response = await fetch(`${csJSON}/${fileName}`)
    const rawDataz = await response.json()

    const optionData = rawDataz.BrokerageTransactions.filter((item: any) =>
      ['Buy to Close', 'Sell to Open', 'Sell to Close', 'Buy to Open'].includes(
        item.Action,
      ),
    )
    return optionData
  } catch (error) {
    console.error('Failed to load options:', error)
    return [] // Return an empty array in case of an error
  }
}

// Parse JSON data
const parseData = (data: any[]): Option[] => {
  return data.map(item => {
    const symbolDetails = item.Symbol.split(' ')
    const ticker = symbolDetails[0]
    const expDate = symbolDetails[1]
    const strike = symbolDetails[2]
    const type = symbolDetails[3] === 'P' ? 'PUT' : 'CALL'
    const longName = item.Description.split(' $')[0] || ''
    const formattedExpDate = new Date(expDate)
    const formattedNow = new Date()

    //helper to see if date is in the future
    const status = formattedExpDate > formattedNow

    return {
      date: item.Date,
      action: item.Action,
      ticker: ticker,
      expDate: expDate,
      strike: parseFloat(strike.replace(/[$,]/g, '')),
      type: type,
      longName: longName,
      description: item.Description,
      quantity: item.Quantity,
      price: parseFloat(item.Price.replace(/[$,]/g, '')),
      feesAndComm: parseFloat(item['Fees & Comm'].replace(/[$,]/g, '')), // Accessing using bracket notation due to special characters & whitespace
      amount: parseFloat(item.Amount.replace(/[$,]/g, '')),
      status: status,
    }
  })
}

onMounted(async () => {
  const rawData = ref([])
  rawData.value = await fetchOptionsData()
  parsedOptions.value = parseData(rawData.value)
})

// State for ticker selection
const selectedTicker = ref('')
const tickers = computed(() => {
  return parsedOptions.value
    .map(option => option.ticker)
    .filter((ticker, index, self) => self.indexOf(ticker) === index)
})
const filteredOptions = computed(() => {
  return parsedOptions.value
    .filter(option => option.ticker === selectedTicker.value)
    .sort(
      (a, b) => new Date(b.expDate).getTime() - new Date(a.expDate).getTime(),
    )
})

// State for running total of option Amount Value
const totalAmount = ref(0)
import { totalFormatter } from '../utils/currencyHelper'

const calculateTotal = (amounts: number[]) => {
  const total = amounts.reduce((total, amount) => total + amount, 0)
  console.log(`total: ${total}`)
  return total
}

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

// Toast function
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const showTemplate = () => {
  console.log('You clicked the template button')
  toast.add({
    severity: 'info',
    summary: 'Template',
    detail: 'This is a template',
    position: 'top-right',
  })

  console.log('Toast added')
}

const showSuccess = () => {
  toast.add({
    severity: 'success',
    summary: 'Success Message',
    detail: 'Message Content',
    life: 3000,
  })
}

const showInfo = () => {
  toast.add({
    severity: 'info',
    summary: 'Info Message',
    detail: 'Message Content',
    life: 3000,
  })
}

const showWarn = () => {
  toast.add({
    severity: 'warn',
    summary: 'Warn Message',
    detail: 'Message Content',
    life: 3000,
  })
}

const showError = () => {
  toast.add({
    severity: 'error',
    summary: 'Error Message',
    detail: 'Message Content',
    life: 3000,
  })
}

const showSecondary = () => {
  toast.add({
    severity: 'secondary',
    summary: 'Secondary Message',
    detail: 'Message Content',
    life: 3000,
  })
}

const showContrast = () => {
  toast.add({
    severity: 'contrast',
    summary: 'Contrast Message',
    detail: 'Message Content',
    life: 3000,
  })
}

/*
TODO:

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
