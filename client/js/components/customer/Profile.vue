<template>
    <div>
        <h1>Profil</h1>
        <form @submit="save">
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label>Vornum</label>
                        <input
                            v-model="profile.name"
                            type="text"
                            class="form-control"
                            placeholder="Vornum"
                            required
                            :readonly="readonly"
                        >
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label>Nochnum</label>
                        <input
                            v-model="profile.surname"
                            type="text"
                            class="form-control"
                            placeholder="Nochnum"
                            required
                            :readonly="readonly"
                        >
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label>Email</label>
                        <input
                            v-model="profile.email"
                            type="email"
                            class="form-control"
                            placeholder="Email"
                            required
                            :readonly="readonly"
                        >
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label>Socktelefonnumra</label>
                        <input
                            v-model="profile.phone_number"
                            type="text"
                            class="form-control"
                            placeholder="Socktelefonnumra"
                            required
                            :readonly="readonly"
                        >
                    </div>
                </div>
            </div>
            <input
                v-if="editable"
                type="submit"
                class="btn btn-primary"
                value="Ouschickn"
            >
        </form>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            profile: {},
            errorMessage: '',
            successMessage: '',
            editable: false,
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
    async created () {
        this.profile = await this.$db.user() || {}
        this.editable = true
    },
    methods: {
        async save (event) {
            event.preventDefault()

            this.editable = false
            this.errorMessage = ''
            this.successMessage = ''
            try {
                this.order = await this.$db.saveUser(this.profile)
                this.successMessage = 'Erfolgreich gschpeichert!'
            }
            catch (e) {
                this.errorMessage = e.message
            }
            this.editable = true
        }
    }
}
</script>

<style>

</style>