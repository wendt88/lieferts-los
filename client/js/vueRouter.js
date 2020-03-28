import Vue from 'vue'
import VueRouter from 'vue-router'

import Index from './components/Index'
import NotFound from './components/NotFound'
import store from './store'

const supplier = import('./components/supplier/index')
const customer = import('./components/customer/index')

Vue.use(VueRouter)
const router = new VueRouter({
    mode: 'history',
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
            children: []
        },
        {
            path: '/supplier/inbox',
            name: 'inbox',
            component: () => supplier.then(components => components.Inbox),
            children: []
        },
        {
            path: '/customer',
            name: 'customer',
            component: () => customer.then(components => components.Customer),
            children: [
                {
                    path: 'login',
                    name: 'login',
                    component: () => customer.then(components => components.Login)
                },
                {
                    path: 'register',
                    name: 'register',
                    component: () => customer.then(components => components.Register)
                },
                {
                    path: 'orders/',
                    name: 'orders',
                    component: () => customer.then(components => components.Orders),
                    meta: {
                        isProtected: true
                    }
                },
                {
                    path: 'orders/:orderID',
                    name: 'order detail',
                    component: () => customer.then(components => components.Order),
                    meta: {
                        isProtected: true
                    }
                },
            ],
        },
        {
            path: '*',
            component: NotFound
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (
        !store.state.user.loggedIn
        && to.meta
        && to.meta.isProtected
    ) {
        next(to.matched[to.matched.length - 2])
        return
    }
    next()
})

export default router
