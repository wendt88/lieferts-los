<template>
    <div>
        <h4>Status</h4>
        <form
            v-if="updateToken"
            @submit="saveOrder"
        >
            <div class="form-group">
                <select
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
            <div class="form-group">
                <label>Voraussichtliche Lieferung am</label>
                <date-time
                    v-model="order.estimated_deliverey"
                    class="form-control"
                    placeholder="Geschätztes Datum und Uhrzeit der Lieferung"
                    :disabled="disabled"
                ></date-time>
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
    },
    methods: {
        async saveOrder () {
            event.preventDefault()

            this.editable = false
            this.errorMessage = ''
            this.successMessage = ''
            try {
                await this.$db.saveOrder({ ...this.order, updateToken: this.updateToken })
                this.successMessage = 'Erfolgreich ogschickt!'
            }
            catch (e) {
                console.error(e)
                this.errorMessage = e.message
            }
            this.editable = true
        }
    }
}
</script>

<style>

</style>