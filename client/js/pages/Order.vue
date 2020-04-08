<template>
    <div class="container mx-auto py-5">
        <h1>
            <span class="fa fa-drumstick-bite"></span>
            Bestellung
        </h1>
        <order
            v-if="editable"
            :order="order"
            :update-token="updateToken"
            :email="email"
            :editable="editable"
            @orderchanged="order = $event"
        >
        </order>
        <template v-else>
            <div class="row mt-4">
                <div class="col-md-6">
                    <order-status
                        :order="order"
                        :update-token="updateToken"
                    ></order-status>
                </div>
                <div class="col-md-6">
                    <address>
                        <strong>{{ order.name }} {{ order.surname }}</strong><br>
                        {{ order.street }} {{ order.street_number }}<br>
                        {{ order.zip_code }} {{ order.city }}<br>
                        <a
                            v-if="order.phone_number"
                            :href="`tel:${order.phone_number}`"
                        >{{ order.phone_number }}</a><br>
                        <a
                            v-if="order.email"
                            :href="`mailto:${order.email}`"
                        >{{ order.email }}</a>
                    </address>
                </div>
            </div>
            <ul class="list-group mt-5">
                <li
                    v-for="(product, i) in order.products"
                    :key="i"
                    class="list-group-item"
                >
                    {{ product.amount }} {{ product.unit }} {{ product.description }}
                </li>
            </ul>
        </template>
    </div>
</template>

<script>
import Order from '../components/order/Order'
import OrderStatus from '../components/order/OrderStatus'

export default {
    components: {
        Order,
        OrderStatus
    },
    props: {
        orderID: {
            type: [String],
            required: true
        },
        updateToken: {
            type: String,
        },
        email: {
            type: String,
        }
    },
    data () {
        return {
            order: {
                products: [
                    {},
                ],
            },
        }
    },
    computed: {
        editable () {
            return this.orderID === 'new'
        }
    },
    watch: {
        async orderID (to, from) {
            if (from === 'new') {
                return
            }
            this.getOrder(to)
        }
    },
    created () {
        this.getOrder(this.orderID)
        if (this.email && this.editable) {
            this.order.supplier_email = this.email
            this.readonlySupplierEmail = true
        }
    },
    methods: {
        async getOrder (id) {
            if (id === 'new') {
                this.order = {
                    products: [
                        {},
                    ],
                }
            }
            else {
                this.order = await this.$db.order(id)
            }
        }
    }
}
</script>
