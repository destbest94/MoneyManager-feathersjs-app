import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const Feathers = require('feathers/client')
const hooks = require('feathers-hooks')
const socketio = require('feathers-socketio/client')
const io = require('socket.io-client')

const socket = io('http://localhost:3030/')
const feathers = Feathers()
.configure(socketio(socket))
.configure(hooks())

feathers.service('messages');

const vueFeathers = require('vue-feathers')

Vue.use(vueFeathers, feathers)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
