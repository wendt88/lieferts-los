<template>
    <div class="min-vh-100 d-flex align-items-center">
        <div
            class="container mx-auto my-5"
            style="max-width: 1000px;"
        >
            <div class="jumbotron">
                <h1 class="display-4">
                    Bringr.io
                </h1>
                <h2 class="display-5 mb-5">
                    local shopping made easy
                </h2>
                <p class="lead">
                    Suppliers manage their orders and clients can track them, all by supporting local businesses and the environment!
                </p>
                <hr class="my-4">
                <form
                    class="needs-validation"
                    novalidate
                    @submit.prevent="submit"
                >
                    <div class="form-row mb-3">
                        <div class="col-md-6">
                            <label for="email">Insert the Email address of your desired supplier</label>
                            <input
                                id="email"
                                ref="email"
                                v-model="email"
                                type="email"
                                class="form-control"
                                required
                            >
                            <div class="invalid-feedback">
                                {{ validationError }}
                            </div>
                        </div>
                    </div>
                    <button
                        class="btn btn-lg btn-primary"
                        type="submit"
                    >
                        Create your order
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            email: '',
            validationError: ''
        }
    },
    methods: {
        submit (e) {
            e.target.classList.add('was-validated')
            if (e.target.checkValidity()) {
                e.target.classList.remove('was-validated')
                this.$set(this, 'validationError', '')

                this.$router
                    .push({
                        name: 'order detail',
                        params: {
                            orderID: 'new'
                        },
                        query: {
                            email: this.email
                        }
                    })
            }
            else {
                this.$set(this, 'validationError', this.$refs.email.validationMessage)
            }
        }
    }
}
</script>