import { createApp } from 'vue'
import App from './App.vue'

import "bootstrap/dist/css/bootstrap.css"
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

// We are not using Axios Base URL - Deprecated since Vue CLI 3.3
// We achived such requirement via Proxy Server also solved the Cors Issue
// import axios from 'axios'
// axios.defaults.baseURL = "http://localhost:8000/public/api/"

createApp(App).mount('#app')