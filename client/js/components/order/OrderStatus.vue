<template>
    <div>
        <h4>Status</h4>
        <form v-if="updateToken">
            <div class="form-group">
                <select
                    v-model="order.status"
                    class="form-control"
                    required
                >
                    <option value="unrecognized">
                        Nicht gewohrnt
                    </option>
                    <option value="processing">
                        Sein derbei
                    </option>
                    <option value="done">
                        Erledigt
                    </option>
                    <option value="rejected">
                        Noa, des mochmer net
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label>Voraussichtliche lieferung am</label>
                <input
                    v-model="order.estimated_deliverey"
                    type="text"
                    class="form-control"
                    placeholder="Geschätztes Datum und Uhrzeit der Lieferung"
                >
            </div>
        </form>
        <div v-else>
            <span :class="`badge badge-pill badge-${STATUS_MAPPING[order.status]}`">{{ order.status }}</span>
        </div>
    </div>
</template>

<script>
const STATUS_MAPPING = {
    'unrecognized': 'secondary',
    'processing': 'warning',
    'done': 'success',
    'rejected': 'danger',
}

const STATUS_TEXT = {
    'unrecognized': 'secondary',
    'processing': 'warning',
    'done': 'success',
    'rejected': 'danger',
}

export default {
    props: {
        order: {
            type: Object,
            required: true,
        },
        updateToken: {
            type: String,
        },
    },
    data: function () {
        return {
            STATUS_MAPPING,
            STATUS_TEXT,
        }
    },
    created () {
        if (!this.order.status) {
            this.order.status = 'unrecognized'
        }
    }
}
</script>

<style>

</style>