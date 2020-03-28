<template>
    <h1>order</h1>
</template>

<script>
export default {
    data: function () {
        return {
            order: []
        }
    },
    watch: {
        async $route (to, from) {
            if (from === 'new') {
                this.editable = true
                this.order = []
            }
            else {
                this.editable = false
                // this.$firebase.
            }
        }
    },
    created () {
        this.db = this.$firebase.firestore()
    }
}
</script>

<style>

</style>