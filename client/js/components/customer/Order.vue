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
                v-for="product of order.products"
                :key="product.id"
                class="row"
            >
                <div class="col">
                    <div class="form-group">
                        <label>Moß</label>
                        <select
                            id="exampleFormControlSelect1"
                            class="form-control"
                        >
                            <option>Kilo</option>
                            <option>Gramm</option>
                            <option>Stuck</option>
                            <option>Liter</option>
                            <option>Maul voll</option>
                        </select>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>Menge</label>
                        <input
                            type="number"
                            class="form-control"
                            placeholder="Menge - sollet a Zohl sein bittschian 😘"
                        >
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>Zuig</label>
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Is Produkt woses gern hett"
                        >
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
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
}
</script>

<style>

</style>