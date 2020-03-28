<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        Register
                    </div>
                    <div class="card-body">
                        <div
                            v-if="error"
                            class="alert alert-danger"
                        >
                            {{ error }}
                        </div>
                        <form
                            action="#"
                            @submit.prevent="submit"
                        >
                            <div class="form-group row">
                                <label
                                    for="name"
                                    class="col-md-4 col-form-label text-md-right"
                                >Name</label>

                                <div class="col-md-6">
                                    <input
                                        id="name"
                                        v-model="form.name"
                                        type="name"
                                        class="form-control"
                                        name="name"
                                        value
                                        required
                                        autofocus
                                    />
                                </div>
                            </div>

                            <div class="form-group row">
                                <label
                                    for="email"
                                    class="col-md-4 col-form-label text-md-right"
                                >Email</label>

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

                            <div class="form-group row">
                                <label
                                    for="shopOwner"
                                    class="col-md-4 col-form-label text-md-right"
                                >Shop Owner</label>

                                <div class="col-md-6">
                                    <input
                                        id="shopOwner"
                                        v-model="form.shopOwner"
                                        type="checkbox"
                                        class="form-control"
                                        name="shopOwner"
                                    />
                                </div>
                            </div>

                            <div class="form-group row mb-0">
                                <div class="col-md-8 offset-md-4">
                                    <button
                                        type="submit"
                                        class="btn btn-primary"
                                    >
                                        Register
                                    </button>
                                    <router-link
                                        to="/login"
                                        tag="button"
                                        class="btn"
                                    >
                                        Login
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
export default {
    data () {
        return {
            form: {
                name: '',
                email: '',
                password: '',
                shopOwner: false
            },
            error: null
        }
    },
    methods: {
        submit () {
            this.$auth.createUserWithEmailAndPassword(this.form)
        }
    }
}
</script>