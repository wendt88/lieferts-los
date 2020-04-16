import Vue from 'vue'
import VueRouter from 'vue-router'

import Index from './components/Index'
// import Login from './components/auth/Login'
// import Register from './components/auth/Register'
import NotFound from './components/NotFound'
import store from './store'

// const supplier = import('./components/supplier/index')
// const customer = import('./components/customer/index')
const order = import('./pages/Order')

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
        // {
        //     path: '/login',
        //     name: 'login',
        //     component: Login
        // },
        // {
        //     path: '/register',
        //     name: 'register',
        //     component: Register
        // },
        // {
        //     path: '/supplier',
        //     name: 'supplier',
        //     component: () => supplier.then(components => components.Supplier)
        // },
        {
            path: '/orders/:orderID',
            name: 'order detail',
            component: () => order.then(components => components.default),
            props: (route) => ({
                updateToken: route.query.updateToken,
                status: route.query.status,
                orderID: route.params.orderID,
                email: route.query.email,
            }),
        },
        // {
        //     path: '/customer',
        //     name: 'customer',
        //     component: () => customer.then(components => components.Customer),
        //     children: [
        //         {
        //             path: 'orders',
        //             name: 'orders',
        //             component: () => customer.then(components => components.Orders),
        //             meta: {
        //                 isProtected: true
        //             }
        //         },
        //         {
        //             path: 'profile',
        //             name: 'profile',
        //             component: () => customer.then(components => components.Profile),
        //             meta: {
        //                 isProtected: true
        //             }
        //         },
        //     ],
        // },
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
        next({
            name: 'login'
        })
        return
    }
    next()
})

export default router
