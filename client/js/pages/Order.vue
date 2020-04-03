<template>
    <div class="container mx-auto py-5">
        <h1 class="mb-4">
            <span class="fa fa-user"></span>
            Bestellung
        </h1>
        <Order
            :order-i-d="orderID"
            :update-token="updateToken"
            :email="email"
        >
        </order>
    </div>
</template>

<script>
import Order from '../components/order/Order'
export default {
    components: {
        Order,
    },
    props: {
        orderID: {
            type: [String, Number],
            required: true
        },
        updateToken: {
            type: String,
        },
        email: {
            type: String,
        }
    },
}
</script>

<style>

</style>
