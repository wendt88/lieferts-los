<template>
    <div>
        <h1>Orders</h1>
        <div
            v-if="orders"
            class="list-group"
        >
            <router-link
                v-for="order in orders"
                :key="order.id"
                :to="{
                    name: 'order detail',
                    params: {
                        orderID: order.id
                    }
                }"
                class="list-group-item list-group-item-action"
            >
                {{ order }}
            </router-link>
        </div>
        <div
            v-else
            class="my-5 text-center"
        >
            <div
                class="spinner-grow text-primary"
                role="status"
            >
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    asyncComputed: {
        orders () {
            console.log(this.$firebase)
        }
    }
}
</script>