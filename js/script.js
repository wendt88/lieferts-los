import Vue from 'vue';
import $ from 'jquery';
require('bootstrap/js/src/collapse');
require('bootstrap/js/src/modal');
require('bootstrap/js/src/scrollspy');
require('bootstrap/js/src/dropdown');

import router from './vueRouter';

global.$ = global.jQuery = $;

new Vue({
    render: createElement => createElement('router-view'),
    router,
})
    .$mount('body > div');