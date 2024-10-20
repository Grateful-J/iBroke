<script setup lang="ts">
// Environment Variables for brokerage statments
const csJSON = import.meta.env.VITE_CS_HISTORY_DIR
const fileName = import.meta.env.VITE_CS_FILENAME

// Fetches JSON from local storage
// TODO: make a drag and drop or user upload
const getHistoryFile = async () => {
  const response = await fetch(`${csJSON}/${fileName}`)
  const data = await response.json()
  return data
}

// on click, get history and make table
const getHistory = async () => {
  const dump = await getHistoryFile()

  if (!dump) {
    return
  }

  const startDate = dump.FromDate
  const endDate = dump.ToDate
  const totalTransactionsAmount = dump.TotalTransactionsAmount

  const data = dump.BrokerageTransactions

  const historyTable = document.getElementById('history-table')

  if (!historyTable) {
    return
  } else {
    const container = document.createElement('div')
    container.innerHTML = `
    <p class="text-xl text-gray-200">Start Date: ${startDate}</p>
    <p class="text-xl text-gray-200">End Date: ${endDate}</p>
    <p class="text-xl text-gray-200">Total Transactions Amount: ${totalTransactionsAmount}</p>
    `

    historyTable.innerHTML = ''

    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      const newRow = document.createElement('tr')
      newRow.innerHTML = `

      <td class="px-6 py-4 whitespace-nowrap text-gray-200 border-b border-gray-200">${row.Date}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-200 border-b border-gray-200">${row.Symbol}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-200 border-b border-gray-200">${row.Description}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-200 border-b border-gray-200">${row.Quantity}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-200 border-b border-gray-200">${row.Price}</td>
      <td class="px-6 py-4 whitespace-nowrap">${row.Amount}</td>
      <td class="px-6 py-4 whitespace-nowrap">${row.Action}</td>


      `
      historyTable?.appendChild(newRow)
    }
  }
}
</script>

<template>
  <main>
    <RouterView />

    <div class="wrapper">
      <h1>iBroke Brokreage Tracker</h1>

      <button @click="getHistory()">Show History</button>

      <div id="history-table">
        <p class="bg-green-600">History Table.....</p>
      </div>

      <div></div>
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
