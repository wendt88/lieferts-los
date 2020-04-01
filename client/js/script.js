import Vue from 'vue'
import AsyncComputed from 'vue-async-computed'
import $ from 'jquery'
require('bootstrap')
import 'pc-bootstrap4-datetimepicker'
import moment from 'moment'
import '@fortawesome/fontawesome-free/css/all.css'

import router from './vueRouter'
import store from './store'
import db from './db'
import auth from './auth'
import firebase from 'firebase'

import DatePicker from './components/DatePicker'

global.$ = global.jQuery = $

Vue.component('DatePicker', DatePicker)
Vue.use(AsyncComputed)
Vue.use({
    install: (Vue) => {
        Object.assign(Vue.prototype, {
            $db: db,
            $auth: auth,
            $moment: moment
        })
    }
})

firebase.auth().onAuthStateChanged(user => {
    store.dispatch('fetchUser', user)

    new Vue({
        render: createElement => createElement('router-view'),
        store,
        router,
    })
        .$mount('body > div')
})