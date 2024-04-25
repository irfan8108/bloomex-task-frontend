import { createApp } from 'vue'
import App from './App.vue'

import "bootstrap/dist/css/bootstrap.css"
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

import axios from 'axios'
axios.defaults.baseURL = "https://54.253.70.47:8000/public/api/"

createApp(App).mount('#app')