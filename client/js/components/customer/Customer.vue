<template>
    <div>
        <nav class="navbar navbar-expand-md navbar-dark bg-dark">
            <router-link
                class="navbar-brand"
                :to="{
                    name: 'customer'
                }"
            >
                Customer
            </router-link>
            <button
                class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbar-menu"
                aria-controls="navbar-menu"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            <div
                id="navbar-menu"
                class="collapse navbar-collapse"
            >
                <ul class="navbar-nav mx-auto">
                    <li class="nav-item">
                        <router-link
                            class="nav-link"
                            :to="{
                                name: 'orders'
                            }"
                        >
                            Orders
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <div
                            class="nav-link"
                            @click="signOut"
                        >
                            Omeldn
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
        <div class="container mx-auto py-5">
            <h1 class="fa fa-user mb-4">
                Customer Area
            </h1>
            <div
                v-if="user"
                class="alert alert-success"
                role="alert"
            >
                Ungmeldn bische!
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import firebase from 'firebase'

export default {
    computed: {
    // map `this.user` to `this.$store.getters.user`
        ...mapGetters({
            user: 'user'
        })
    },
    methods: {
        signOut () {
            this.$auth.signOut().then(() => {
                console.log('signout')
                this.$store.dispatch('fetchUser', firebase.auth().currentUser)
                // this.$router.replace({
                //     name: ''
                // })
            })
        }
    }
}
</script>