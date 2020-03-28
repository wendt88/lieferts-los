<template>
    <div>
        <div class="container mx-auto d-flex align-items-center justify-content-center">
            <routerLink
                :to="{
                    name: 'login'
                }"
            >
                <h1>Login</h1>
            </routerLink>
        </div>
        <div class="min-vh-100 container mx-auto row my-5">
            <div
                v-for="section in sections"
                :key="section"
                class="col-sm-6"
            >
                <div class="card h-100">
                    <div class="card-body d-flex align-items-center justify-content-center">
                        <router-link
                            :to="{
                                name: section
                            }"
                            class="stretched-link"
                        >
                            <h1>{{ section }}</h1>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            sections: [
                'customer',
                'inbox'
            ]
        }
    }
}
</script>