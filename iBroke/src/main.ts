import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

//import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: 'none',
})
app.use(ToastService)

app.mount('#app')
