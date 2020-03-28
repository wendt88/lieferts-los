<template>
    <div>
        <nav class="navbar navbar-expand-md navbar-dark bg-dark">
            <router-link
                class="navbar-brand"
                :to="{
                    name: 'customer'
                }"
            >
                Customer Area
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
                    <template v-if="user.loggedIn">
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
                            <router-link
                                class="nav-link"
                                :to="{
                                    name: 'profile'
                                }"
                            >
                                Meina Adressa
                            </router-link>
                        </li>
                    </template>
                </ul>
                <ul class="navbar-nav ml-auto">
                    <template v-if="!user.loggedIn">
                        <li class="nav-item">
                            <router-link
                                class="nav-link"
                                :to="{
                                    name: 'login'
                                }"
                            >
                                Inloggn
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link
                                class="nav-link"
                                :to="{
                                    name: 'register'
                                }"
                            >
                                Registriern
                            </router-link>
                        </li>
                    </template>
                    <li
                        v-else
                        class="nav-item"
                    >
                        <a
                            class="nav-link"
                            href="#"
                            @click.prevent="signOut"
                        >
                            <span class="fa fa-sign-out-alt"></span>
                            Oufliagn
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
        <div class="container mx-auto py-5">
            <h1 class="mb-4">
                <span class="fa fa-user"></span>
                Customer Area
            </h1>
            <div
                v-if="user.loggedIn"
                class="alert alert-success"
                role="alert"
            >
                Ungmeldn bische, du schmugu! SCHWEIIIIN: {{ user.data.email }}, {{ this.$auth.currentUserId() }}
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

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
                this.$router.replace({
                    name: 'customer'
                })
            })
        }
    }
}
</script>