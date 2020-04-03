<template>
    <div>
        <h1>
            <span class="fa fa-drumstick-bite"></span>
            Bestellung
        </h1>
        <order-status
            class="mt-2"
            :order="order"
            :update-token="updateToken"
        ></order-status>
        <form @submit="saveOrder">
            <div class="form-group">
                <label>Lieferant</label>
                <input
                    v-model="order.supplier"
                    type="text"
                    class="form-control"
                    placeholder="Liefernant inenspeibn"
                    :readonly="readonly"
                    required
                >
            </div>
            <div
                class="row"
            >
                <div class="col-md-4">
                    <div class="form-group">
                        <h4>Moß</h4>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <h4>Menge</h4>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <h4>Zuig</h4>
                    </div>
                </div>
            </div>
            <div
                v-for="(product, index) of order.products"
                :key="product.id"
                class="row"
            >
                <div class="col-md-4">
                    <div class="form-group">
                        <select
                            v-model="order.products[index].unit"
                            class="form-control"
                            :disabled="disabled"
                            required
                        >
                            <option value="kg">
                                Kilo
                            </option>
                            <option value="g">
                                Gramm
                            </option>
                            <option value="pieces">
                                Stuck
                            </option>
                            <option value="l">
                                Liter
                            </option>
                            <option value="mv">
                                Maul voll
                            </option>
                            <option value="tiggisch">
                                Wollten awian
                            </option>
                            <option value="flietscha">
                                Schun awian a flietscha
                            </option>
                        </select>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <input
                            v-model="order.products[index].amount"
                            type="number"
                            class="form-control"
                            placeholder="Menge - sollet a Zohl sein bittschian 😘"
                            required
                            :readonly="readonly"
                        >
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <input
                            v-model="order.products[index].description"
                            type="text"
                            class="form-control"
                            placeholder="Is Produkt woses gern hett"
                            :readonly="readonly"
                            required
                            @keyup="addNewRowIfLast(index)"
                        >
                    </div>
                </div>
            </div>
            <div
                v-if="errorMessage"
                class="alert alert-danger"
                role="alert"
            >
                {{ errorMessage }}
            </div>
            <div
                v-if="successMessage"
                class="alert alert-success"
                role="alert"
            >
                {{ successMessage }}
            </div>
            <input
                v-if="editable"
                type="submit"
                class="btn btn-primary"
                value="Ouschickn"
                @click="sanitizeProducts"
            >
        </form>
    </div>
</template>

<script>

import OrderStatus from './OrderStatus'

// TODO: photo upload per product
// TODO: barcode scanner per product

export default {
    components: {
        OrderStatus,
    },
    props: {
        orderID: {
            type: [String, Number],
            required: true
        },
        updateToken: {
            type: String,
        },
    },
    data: function () {
        return {
            order: {
                products: [
                    {},
                ],
            },
            editable: false,
            errorMessage: '',
            successMessage: '',
        }
    },
    computed: {
        readonly () {
            return this.editable ? false : 'readonly'
        },
        disabled () {
            return this.editable ? false : 'disabled'
        }
    },
    watch: {
        async orderID (to, from) {
            if (from === 'new') {
                return
            }
            this.$set(this, 'successMessage', '')
            this.getOrder(to)
        }
    },
    async created () {
        this.getOrder(this.orderID)
    },
    methods: {
        async getOrder (id) {
            if (id === 'new') {
                this.editable = true
                this.order = {
                    products: [
                        {},
                    ],
                }
            }
            else {
                this.editable = false
                this.order = await this.$db.order(id)
            }
        },
        addNewRowIfLast (index) {
            if (!this.editable) {
                return
            }
            if (this.order.products.length-1 === index) {
                this.order.products.push({})
            }
        },
        sanitizeProducts () {
            if (this.order.products.length > 1 && !this.order.products[this.order.products.length-1].description) {
                this.order.products.pop()
            }
        },
        async saveOrder (event) {
            event.preventDefault()

            this.editable = false
            this.errorMessage = ''
            this.successMessage = ''
            try {
                this.order = await this.$db.saveOrder(this.order)
                this.$router.push({ name: 'order detail', params: { orderID: this.order.id } })
                this.successMessage = 'Erfolgreich ogschickt!'
            }
            catch (e) {
                console.error(e)
                this.errorMessage = e.message
                this.editable = true
            }
        }
    }
}
</script>