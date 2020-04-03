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
                    <option
                        v-for="(value, key) in STATUS_TEXT"
                        :key="key"
                        :value="key"
                    >
                        {{ value }}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label>Voraussichtliche Lieferung am</label>
                <input
                    v-model="order.estimated_deliverey"
                    type="text"
                    class="form-control"
                    placeholder="Geschätztes Datum und Uhrzeit der Lieferung"
                >
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
                type="submit"
                class="btn btn-primary mb-1"
                value="Ouschickn"
            >
        </form>
        <div v-else>
            <span :class="`badge badge-pill badge-${STATUS_MAPPING[order.status]}`">{{ STATUS_TEXT[order.status] }}</span>
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
    'unrecognized': 'Nicht gewohrnt',
    'processing': 'Sein derbei',
    'done': 'Erledigt',
    'rejected': 'Noa, des mochmer net',
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
            errorMessage: '',
            successMessage: '',
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