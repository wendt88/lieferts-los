<template>
    <div>
        <form
            class="needs-validation"
            novalidate
            @submit.prevent="saveOrder"
        >
            <h4>Lieferant</h4>
            <div class="form-group">
                <label for="supplier_email">Email</label>
                <input
                    id="supplier_email"
                    v-model="order.supplier_email"
                    name="supplier_email"
                    type="email"
                    class="form-control"
                    placeholder="Liefernant inenspeibn"
                    :readonly="readonly || readonlySupplierEmail"
                    required
                >
                <div class="invalid-feedback">
                    {{ validationErrors.supplier_email }}
                </div>
            </div>
            <h4>Kunde</h4>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input
                            id="email"
                            v-model="order.email"
                            name="email"
                            type="email"
                            class="form-control"
                            placeholder="Email"
                            :readonly="readonly"
                            :required="!order.phone_number"
                        >
                        <div class="invalid-feedback">
                            {{ validationErrors.email }}
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="phone_number">Telefonnummer</label>
                        <input
                            id="phone_number"
                            v-model="order.phone_number"
                            name="phone_number"
                            type="text"
                            class="form-control"
                            placeholder="Telefonnummer"
                            :required="!order.email"
                            :readonly="readonly"
                        >
                        <div class="invalid-feedback">
                            {{ validationErrors.phone_number }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="name">Vorname</label>
                        <input
                            id="name"
                            v-model="order.name"
                            name="name"
                            type="text"
                            class="form-control"
                            placeholder="Vorname"
                            required
                            :readonly="readonly"
                        >
                        <div class="invalid-feedback">
                            {{ validationErrors.name }}
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="surname">Nachname</label>
                        <input
                            id="surname"
                            v-model="order.surname"
                            name="surname"
                            type="text"
                            class="form-control"
                            placeholder="Nachname"
                            required
                            :readonly="readonly"
                        >
                        <div class="invalid-feedback">
                            {{ validationErrors.surname }}
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="street">Straße</label>
                        <input
                            id="street"
                            v-model="order.street"
                            name="street"
                            type="text"
                            class="form-control"
                            placeholder="Straße"
                            required
                            :readonly="readonly"
                        >
                        <div class="invalid-feedback">
                            {{ validationErrors.street }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="street_number">Straßennummer</label>
                        <input
                            id="street_number"
                            v-model="order.street_number"
                            name="street_number"
                            type="text"
                            class="form-control"
                            placeholder="Straßennummer"
                            required
                            :readonly="readonly"
                        >
                        <div class="invalid-feedback">
                            {{ validationErrors.street_number }}
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="city">Ort</label>
                        <input
                            id="city"
                            v-model="order.city"
                            name="city"
                            type="text"
                            class="form-control"
                            placeholder="Ort"
                            required
                            :readonly="readonly"
                        >
                        <div class="invalid-feedback">
                            {{ validationErrors.city }}
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="zip_code">Postleitzahl</label>
                        <input
                            id="zip_code"
                            v-model="order.zip_code"
                            name="zip_code"
                            type="text"
                            class="form-control"
                            placeholder="Postleitzahl"
                            required
                            :readonly="readonly"
                        >
                        <div class="invalid-feedback">
                            {{ validationErrors.zip_code }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <div class="custom-control custom-switch">
                            <input
                                id="accept"
                                type="checkbox"
                                class="custom-control-input"
                                :disabled="disabled"
                                required
                            >
                            <label
                                class="custom-control-label"
                                for="accept"
                            >Mit dem Aktivieren dieser Checkbox erkläre ich mich einverstanden, dass diese Seite die von mir angegebenen Daten speichert und an die, auf dieser Seite angegebenen, e-Mail Adressen verschickt. Außerdem nehme ich zur Kenntnis, dass die Bestellung und Zahlung der Ware vom Empfänger der Bestellung und nicht von dieser Webseite bearbeitet werden.</label>
                            <div class="invalid-feedback">
                                {{ validationErrors.accept }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h3>Bestellung</h3>
            <div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <label
                            for="type"
                        >Typ</label>
                        <select
                            id="type"
                            v-model="order.type"
                            class="form-control"
                            :disabled="disabled"
                            required
                        >
                            <option value="delivery">
                                Lieferung
                            </option>
                            <option value="collection">
                                Abholung
                            </option>
                        </select>
                        <div class="invalid-feedback">
                            {{ validationErrors['type'] }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="row d-none d-md-flex">
                <div class="col-md-2">
                    <h4>Menge</h4>
                </div>
                <div class="col-md-2">
                    <h4>Maß</h4>
                </div>
                <div class="col-md-8">
                    <h4>Produkt</h4>
                </div>
            </div>
            <div
                v-for="(product, index) of order.products"
                :key="product.id"
                :class="{
                    'border-top pt-3': !!index
                }"
                class="row"
            >
                <div class="col-6 col-md-2">
                    <div class="form-group">
                        <label
                            :for="`amount-${index}`"
                            class="d-md-none"
                        >Menge</label>
                        <input
                            :id="`amount-${index}`"
                            v-model.number="order.products[index].amount"
                            type="number"
                            min="0"
                            class="form-control"
                            placeholder="Menge - sollet a Zohl sein bittschian 😘"
                            required
                            :readonly="readonly"
                        >
                        <div class="invalid-feedback">
                            {{ validationErrors[`amount-${index}`] }}
                        </div>
                    </div>
                </div>
                <div class="col-6 col-md-2">
                    <div class="form-group">
                        <label
                            :for="`unit-${index}`"
                            class="d-md-none"
                        >Maß</label>
                        <select
                            :id="`unit-${index}`"
                            v-model="order.products[index].unit"
                            class="form-control"
                            :disabled="disabled"
                            required
                        >
                            <option value="pieces">
                                Stück
                            </option>
                            <option value="g">
                                Gramm
                            </option>
                            <option value="kg">
                                Kilogramm
                            </option>
                            <option value="l">
                                Liter
                            </option>
                            <option value="l">
                                Milliliter
                            </option>
                            <option value="other">
                                Anderes
                            </option>
                        </select>
                        <div class="invalid-feedback">
                            {{ validationErrors[`unit-${index}`] }}
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-8">
                    <div class="form-group">
                        <label
                            :for="`product-${index}`"
                            class="d-md-none"
                        >Produkt</label>
                        <input
                            :id="`product-${index}`"
                            v-model="order.products[index].description"
                            type="text"
                            class="form-control"
                            placeholder="Gewünschtes Produkt"
                            :readonly="readonly"
                            required
                            @keyup="addNewRowIfLast(index)"
                        >
                        <div class="invalid-feedback">
                            {{ validationErrors[`product-${index}`] }}
                        </div>
                    </div>
                </div>
            </div>
            <vue-recaptcha
                class="mb-2"
                :sitekey="reCaptchaSiteKey"
                @verify="reCaptchaValidated"
                @expired="reCaptchaOnExpired"
            >
            </vue-recaptcha>
            <div
                v-if="errorMessage"
                class="alert alert-danger"
                role="alert"
            >
                {{ errorMessage }}
            </div>
            <div
                v-if="loadingMessage"
                class="alert alert-light"
                role="alert"
            >
                {{ loadingMessage }}
            </div>
            <div
                v-if="successMessage"
                class="alert alert-success"
                role="alert"
            >
                {{ successMessage }}
            </div>
            <input
                v-if="editable"
                type="submit"
                class="btn btn-primary"
                value="Abschicken"
                @click="sanitizeProducts"
            >
        </form>
    </div>
</template>

<script>

import VueRecaptcha from 'vue-recaptcha'
import config from '../../config'

// TODO: photo upload per product
// TODO: barcode scanner per product

export default {
    components: {
        VueRecaptcha,
    },
    props: {
        order: {
            type: Object,
            required: true
        },
        updateToken: {
            type: String,
        },
        email: {
            type: String,
        },
        editable: {
            type: Boolean,
        }
    },
    data: function () {
        return {
            reCaptchaSiteKey: config.reCaptchaSiteKey,
            errorMessage: '',
            loadingMessage: '',
            successMessage: '',
            readonlySupplierEmail: false,
            validationErrors: {}
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
    watch: {
        async orderID (to, from) {
            if (from === 'new') {
                return
            }
            this.$set(this, 'successMessage', '')
        }
    },
    created () {
        if (this.email && this.editable) {
            this.readonlySupplierEmail = true
        }
        if (this.editable) {
            let recaptchaScript = document.createElement('script')
            recaptchaScript.setAttribute('src', 'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit')
            document.head.appendChild(recaptchaScript)
        }
    },
    methods: {
        addNewRowIfLast (index) {
            if (!this.editable) {
                return
            }
            if (this.order.products.length-1 === index) {
                this.order.products.push({ amount: 1, unit: 'pieces' })
            }
        },
        sanitizeProducts () {
            if (this.order.products.length > 1 && !this.order.products[this.order.products.length-1].description) {
                this.order.products.pop()
            }
        },
        async saveOrder (event) {
            event.target.classList.add('was-validated')
            this.errorMessage = ''
            if (!this.order.reCaptchaResponse) {
                this.errorMessage = 'Bitte reCaptcha lösen'
                return
            }
            if (event.target.checkValidity()) {
                event.target.classList.remove('was-validated')
                this.$set(this, 'validationErrors', {})

                this.editable = false
                this.loadingMessage = 'Bestellung wird gespeichert und versendet...'
                this.successMessage = ''
                try {
                    let order = await this.$db.saveOrder(this.order)
                    this.$emit('orderchanged', order)
                    this.$router.push({
                        name: 'order detail',
                        params: {
                            orderID: order.id
                        }
                    })
                    this.successMessage = 'Erfolgreich versendet!'
                }
                catch (e) {
                    console.error(e)
                    this.errorMessage = e.message
                    this.editable = true
                }
                this.loadingMessage = ''
            }
            else {
                $(':invalid[id]', event.target)
                    .each((i, el) => {
                        this.$set(this.validationErrors, el.id, el.validationMessage)
                    })
            }
        },
        reCaptchaValidated (response) {
            this.order.reCaptchaResponse = response
        },
        reCaptchaOnExpired () {
            this.order.reCaptchaResponse = null
        }
    },
}
</script>