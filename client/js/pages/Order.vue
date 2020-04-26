<template>
    <div class="container mx-auto py-5">
        <h1>
            <span class="fa fa-drumstick-bite"></span>
            Bestellung
        </h1>
        <div
            v-if="loading"
            class="d-flex justify-content-center align-items-center"
            style="height: 20vh"
        >
            <i class="fas fa-sync fa-spin fa-2x"></i>
        </div>
        <div
            v-else-if="errorMessage"
            class="d-flex justify-content-center align-items-center"
            style="height: 20vh"
            v-text="errorMessage"
        >
        </div>
        <div v-else>
            <order
                v-if="editable"
                :order="order"
                :update-token="updateToken"
                :email="email"
                :is-editable="editable"
            >
            </order>
            <template v-else>
                <div class="row mt-4">
                    <div class="col-md-6">
                        <order-status
                            :order="order"
                            :update-token="updateToken"
                            :status="status"
                        ></order-status>
                    </div>
                    <div class="col-md-6">
                        <address>
                            <strong v-text="`${order.name} ${order.surname}`"></strong><br>
                            <span v-text="`${order.street } ${order.street_number}`"></span><br>
                            <span v-text="`${order.zip_code } ${order.city}`"></span><br>
                            <a
                                v-if="order.phone_number"
                                :href="`tel:${order.phone_number}`"
                                v-text="order.phone_number"
                            ></a><br>
                            <a
                                v-if="order.email"
                                :href="`mailto:${order.email}`"
                                v-text="order.email"
                            ></a>
                        </address>
                    </div>
                </div>
                <ul class="list-group mt-5">
                    <li
                        v-for="(product, i) in order.products"
                        :key="i"
                        class="list-group-item"
                        v-text="`${product.amount} ${product.unit} ${product.description}`"
                    >
                    </li>
                </ul>
            </template>
        </div>
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
        status: {
            type: String,
        },
        email: {
            type: String,
        }
    },
    data () {
        return {
            loading: true,
            order: {
                products: [
                    { amount: 1, unit: 'pieces' },
                ],
            },
            editable: this.orderID === 'new'
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
            this.errorMessage = ''
            if (id === 'new') {
                this.order = {
                    products: [
                        { amount: 1, unit: 'pieces' },
                    ],
                }
            }
            else {
                try {
                    this.order = await this.$db.order(id)
                }
                catch (e) {
                    this.errorMessage = 'order not found'
                    console.error(e)
                }
            }
            this.loading = false
        }
    }
}
</script>
