import 'promise-polyfill/src/polyfill';
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'vuetify/dist/vuetify.css'
import App from './App.vue'
import router from './router'

Vue.use(require('vue-moment'));

Vue.use(VueAxios, axios)
Vue.use(Vuetify)
Vue.use(VueRouter)


new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
