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
                </ul>
            </div>
        </nav>
        <div class="container mx-auto py-5">
            <h1 class="fa fa-user mb-4">
                Customer Area
            </h1>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {

}
</script>