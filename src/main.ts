import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

declare global {
    interface Window { Unity: any; }
  }