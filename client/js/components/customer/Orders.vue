<template>
    <div>
        <div class="d-flex align-items-center mb-3">
            <h1 class="mb-0">
                <span class="fa fa-shopping-bag"></span>
                Orders
            </h1>
            <router-link
                :to="{
                    name: 'order detail',
                    params: {
                        orderID: 'new'
                    }
                }"
                class="btn btn-primary ml-auto"
            >
                <span class="fa fa-plus"></span>&nbsp;
                Nui
            </router-link>
        </div>
        <div class="list-group">
            <router-link
                v-for="order in orders"
                :key="order.id"
                ref="orders"
                :to="{
                    name: 'order detail',
                    params: {
                        orderID: order.id
                    }
                }"
                class="list-group-item list-group-item-action"
            >
                <h3 v-text="order.supplier"></h3>
                <ul>
                    <li
                        v-for="(product, i) in order.products"
                        :key="i"
                        v-text="`${product.amount} ${product.unit} ${product.description}`"
                    >
                    </li>
                </ul>
            </router-link>
        </div>
        <div
            v-if="isRequesting"
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
    props: {
        page: {
            type: [String, Number],
            default: 1
        }
    },
    data () {
        return {
            orders: [],
            isRequesting: false,
            lastDocument: null
        }
    },
    watch: {
        lastDocument: {
            async handler (lastDocument) {
                this.$set(this, 'isRequesting', true)
                let orders = await this.$db.queryOrders({
                    lastDocument
                })
                this.orders.push(...orders)
                if (!orders.length) {
                    $(window)
                        .off('scroll', this.onScroll)
                }
                this.$set(this, 'isRequesting', false)
            },
            immediate: true
        }
    },
    mounted () {
        $(window)
            .scroll(this.onScroll)
    },
    methods: {
        onScroll () {
            if (!this.isRequesting && $(window).scrollTop() + $(window).height() > $(document).height() - 50) {
                this.$set(this, 'lastDocument', this.orders[this.orders.length - 1])
            }
        }
    }
}
</script>