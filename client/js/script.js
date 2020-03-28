import Vue from 'vue'
import * as firebase from 'firebase'
import AsyncComputed from 'vue-async-computed'
import $ from 'jquery'
require('bootstrap/js/src/collapse')
require('bootstrap/js/src/modal')
require('bootstrap/js/src/scrollspy')
require('bootstrap/js/src/dropdown')
import '@fortawesome/fontawesome-free/css/all.css'

import router from './vueRouter'
import store from './store'

global.$ = global.jQuery = $

const firebaseConfig = {
    apiKey: 'AIzaSyDNOkG57a_ZYl8qbwn5YMSIO9BGjbwHkFU',
    authDomain: 'bringr-io-dev.firebaseapp.com',
    databaseURL: 'https://bringr-io-dev.firebaseio.com',
    projectId: 'bringr-io-dev',
    storageBucket: 'bringr-io-dev.appspot.com',
    messagingSenderId: '103924518486',
    appId: '1:103924518486:web:40cc6fd2c7c822f903b5f7',
    measurementId: 'G-T64131CJ15'
}

firebase.initializeApp(firebaseConfig)

Vue.use(AsyncComputed)
Vue.use({
    install: (Vue) => {
        Object.assign(Vue.prototype, {
            $firebase: firebase
        })
    }
})

new Vue({
    render: createElement => createElement('router-view'),
    store,
    router,
})
    .$mount('body > div')