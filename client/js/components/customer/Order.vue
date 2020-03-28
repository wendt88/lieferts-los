<template>
    <div>
        <h1>Bestellung</h1>
        <form>
            <div class="form-group">
                <label>Lieferant</label>
                <input
                    type="text"
                    class="form-control"
                    placeholder="Liefernant inenspeibn"
                >
            </div>
            <div
                class="row"
            >
                <div class="col">
                    <div class="form-group">
                        <h4>Moß</h4>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <h4>Menge</h4>
                    </div>
                </div>
                <div class="col">
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
                <div class="col">
                    <div class="form-group">
                        <select
                            id="exampleFormControlSelect1"
                            v-model="order.products[index].unit"
                            class="form-control"
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
                        </select>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <input
                            v-model="order.products[index].amount"
                            type="number"
                            class="form-control"
                            placeholder="Menge - sollet a Zohl sein bittschian 😘"
                        >
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <input
                            v-model="order.products[index].description"
                            type="text"
                            class="form-control"
                            placeholder="Is Produkt woses gern hett"
                            @keyup="addNewRowIfLast(index)"
                        >
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>

// TODO: photo upload per product
// TODO: barcode scanner per product

export default {
    data: function () {
        return {
            order: {
                products: [
                    {},
                ],
            }
        }
    },
    watch: {
        async $route (to, from) {
            if (from === 'new') {
                this.editable = true
                this.order = {
                    products: [
                        {},
                    ],
                }
            }
            else {
                this.editable = false
                this.order = await this.$db.order(to)
            }
        }
    },
    methods: {
        addNewRowIfLast (index) {
            if (this.order.products.length-1 === index) {
                this.order.products.push({})
            }
            console.log(this.order.products)
        }
    }
}
</script>

<style>

</style>