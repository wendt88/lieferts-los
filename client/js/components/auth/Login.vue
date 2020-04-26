<template>
    <div class="container">
        <div class="row my-5 justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        Login
                    </div>
                    <div class="card-body">
                        <div
                            v-if="error"
                            class="alert alert-danger"
                            v-text="error"
                        >
                        </div>
                        <form
                            action="#"
                            @submit.prevent="submit"
                        >
                            <div class="form-group row">
                                <label
                                    for="email"
                                    class="col-md-4 col-form-label text-md-right"
                                >E-Mail</label>

                                <div class="col-md-6">
                                    <input
                                        id="email"
                                        v-model="form.email"
                                        type="email"
                                        class="form-control"
                                        name="email"
                                        value
                                        required
                                        autofocus
                                    />
                                </div>
                            </div>

                            <div class="form-group row">
                                <label
                                    for="password"
                                    class="col-md-4 col-form-label text-md-right"
                                >Password</label>

                                <div class="col-md-6">
                                    <input
                                        id="password"
                                        v-model="form.password"
                                        type="password"
                                        class="form-control"
                                        name="password"
                                        required
                                    />
                                </div>
                            </div>

                            <div class="form-group row mb-0">
                                <div class="col-md-8 offset-md-4">
                                    <button
                                        type="submit"
                                        class="btn btn-primary"
                                    >
                                        Login
                                    </button>
                                    <router-link
                                        to="/register"
                                        tag="button"
                                        class="btn"
                                    >
                                        Register
                                    </router-link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    data () {
        return {
            form: {
                email: '',
                password: ''
            },
            error: null
        }
    },
    methods: {
        submit () {
            firebase
                .auth()
                .signInWithEmailAndPassword(this.form.email, this.form.password)
                .then(() => {
                    this.$router.replace({ name: 'customer' })
                })
                .catch(err => {
                    this.error = err.message
                })
        }
    }
}
</script>