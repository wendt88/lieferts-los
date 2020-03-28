import Vue from 'vue'
import AsyncComputed from 'vue-async-computed'
import $ from 'jquery'
require('bootstrap/js/src/collapse')
require('bootstrap/js/src/modal')
require('bootstrap/js/src/scrollspy')
require('bootstrap/js/src/dropdown')
import '@fortawesome/fontawesome-free/css/all.css'

import router from './vueRouter'
import store from './store'
import db from './db'

global.$ = global.jQuery = $

Vue.use(AsyncComputed)

Vue.use({
    install: (Vue) => {
        Object.assign(Vue.prototype, {
            $db: db
        })
    }
})

new Vue({
    render: createElement => createElement('router-view'),
    store,
    router,
})
    .$mount('body > div')