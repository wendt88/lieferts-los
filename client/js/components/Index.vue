<template>
    <div class="min-vh-100 d-flex align-items-center flex-column">
        <div
            class="container"
        >
            <languages-switcher class="mt-3 float-right"></languages-switcher>
        </div>
        <div
            class="container mx-auto my-5"
            style="max-width: 1000px;"
        >
            <div class="jumbotron mb-0">
                <h1 class="display-4">
                    Bringr.io
                </h1>
                <h2 class="display-5 mb-5">
                    local shopping made easy
                </h2>
                <p
                    class="lead"
                    v-text="$labels.description"
                >
                </p>
                <p>
                    <ul>
                        <li>Einfache Einkaufsliste wird in klarer Form übermittelt</li>
                        <li>Abholung/Lieferung minimiert das Risiko einer Ansteckung an Covid-19 des Verkaufspersonals!</li>
                        <li>Keine langen Warteschlangen vor den Supermärkten mehr!</li>
                    </ul>
                </p>
                <p class="lead">
                    Und das ganz ohne Registrierung!
                </p>
                <hr class="my-4">
                <form
                    class="needs-validation"
                    novalidate
                    @submit.prevent="submit"
                >
                    <div class="form-row mb-3">
                        <div class="col-md-12">
                            <label for="email">Einfach die Mail des gewünschten Geschäftes oder Betriebes eintragen:</label>
                            <input
                                id="email"
                                ref="email"
                                v-model="email"
                                type="email"
                                class="form-control form-control-lg"
                                required
                            >
                            <div
                                class="invalid-feedback"
                                v-text="validationError"
                            >
                            </div>
                        </div>
                    </div>
                    <button
                        class="btn btn-lg btn-primary"
                        type="submit"
                    >
                        Mit dem Bestellen loslegen!
                    </button>
                </form>
                <div
                    style="padding: 50px 0 0;"
                >
                    <p class="lead">
                        Wie sieht eine Bestellung beim Händler aus?
                    </p>
                    <div class="align-items-center">
                        <div
                            class="container mx-auto"
                            style="max-width: 500px;"
                        >
                            <img
                                style="width: 100%;"
                                src="../../assets/example-order.png"
                                alt=""
                            >
                        </div>
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