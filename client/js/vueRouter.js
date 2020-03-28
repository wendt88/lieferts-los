import Vue from 'vue';
import VueRouter from 'vue-router';

import Index from './components/Index';
const supplier = import('./components/supplier/index');
const customer = import('./components/customer/index');

Vue.use(VueRouter);
export default new VueRouter({
    // mode: 'history',
    linkActiveClass: 'active',
    linkExactActiveClass: 'active',
    routes: [
        {
            path: '/',
            name: 'index',
            component: Index
        },
        {
            path: '/supplier',
            name: 'supplier',
            component: () => supplier.then(components => components.Supplier),
            children: [

            ]
        },
        {
            path: '/customer',
            name: 'customer',
            component: () => customer.then(components => components.Customer),
            children: [

            ]
        }
    ]
});