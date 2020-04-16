<template>
    <div>
        <form
            v-if="updateToken"
            @submit="saveOrder"
        >
            <div class="form-group">
                <label for="order-sattus">Status</label>
                <select
                    id="order-sattus"
                    v-model="order.status"
                    class="form-control"
                    :disabled="disabled"
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
            <div
                v-if="order.status === 'processing' || order.status === 'accepted'"
                class="form-group position-relative"
            >
                <label>Voraussichtliche Lieferung/Abholung am</label>
                <date-picker
                    v-model="order.estimated_deliverey"
                    class="form-control"
                    placeholder="Geschätztes Datum und Uhrzeit der Lieferung"
                    :disabled="disabled"
                ></date-picker>
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
                value="Abschicken"
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
    'accepted': 'warning',
    'processing': 'warning',
    'done': 'success',
    'rejected': 'danger',
}

const STATUS_TEXT = {
    'unrecognized': 'Antwort ausständig',
    'accepted': 'Angenommen',
    'processing': 'In Arbeit',
    'done': 'Erledigt',
    'rejected': 'Abgelehnt',
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
        status: {
            type: String,
        },
    },
    data: function () {
        return {
            editable: true,
            STATUS_MAPPING,
            STATUS_TEXT,
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
    created () {
        if (!this.order.status) {
            this.order.status = 'unrecognized'
        }
        if (this.isValidStatus(this.status)) {
            this.order.status = this.status
        }
    },
    methods: {
        async saveOrder () {
            event.preventDefault()

            this.editable = false
            this.errorMessage = ''
            this.successMessage = ''
            try {
                await this.$db.saveOrder({ ...this.order, updateToken: this.updateToken })
                this.successMessage = 'Erfolgreich verschickt!'
            }
            catch (e) {
                console.error(e)
                this.errorMessage = e.message
            }
            this.editable = true
        },
        isValidStatus(status) {
            return Object.keys(STATUS_TEXT).filter(st => st === status).length > 0
        }
    }
}
</script>

<style>

</style>