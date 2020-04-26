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
                        <label>E-Mail</label>
                        <input
                            v-model="profile.email"
                            type="email"
                            class="form-control"
                            placeholder="E-Mail"
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
                <div class="col-md-4">
                    <div class="form-group">
                        <label>Kaff</label>
                        <input
                            v-model="profile.city"
                            type="text"
                            class="form-control"
                            placeholder="Kaff"
                            required
                            :readonly="readonly"
                        >
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label>Straßl Numra</label>
                        <input
                            v-model="profile.street_no"
                            type="text"
                            class="form-control"
                            placeholder="Straßl Numra"
                            required
                            :readonly="readonly"
                        >
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label>Straßl</label>
                        <input
                            v-model="profile.street"
                            type="text"
                            class="form-control"
                            placeholder="Straßl"
                            required
                            :readonly="readonly"
                        >
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label>Postleitzohl</label>
                        <input
                            v-model="profile.zipcode"
                            type="text"
                            class="form-control"
                            placeholder="Postleitzohl"
                            required
                            :readonly="readonly"
                        >
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label>Hinweiß</label>
                        <textarea
                            v-model="profile.advice"
                            type="text"
                            class="form-control"
                            placeholder="Wia find i hin?"
                            required
                            :readonly="readonly"
                        ></textarea>
                    </div>
                </div>
            </div>
            <div
                v-if="errorMessage"
                class="alert alert-danger"
                role="alert"
                v-text="errorMessage"
            >
            </div>
            <div
                v-if="successMessage"
                class="alert alert-success"
                role="alert"
                v-text="successMessage"
            >
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
                this.profile = await this.$db.saveUser(this.profile)
                this.successMessage = 'Erfolgreich gschpeichert!'
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