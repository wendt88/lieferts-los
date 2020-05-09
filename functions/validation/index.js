const Joi = require('@hapi/joi')

const ERROR_TYPE = 'validation-error'

const ORDER_TYPES = [
    'delivery',
    'collection',
]

const PRODUCT_UNITS = [
    'pieces',
    'g',
    'kg',
    'l',
    'ml',
    'other',
]

const ORDER_STATUS = [
    'unrecognized',
    'accepted',
    'processing',
    'done',
    'rejected',
]

module.exports = {
    ERROR_TYPE,
    ORDER_STATUS,
    ORDER_TYPES,
    PRODUCT_UNITS,
    validateOrder,
    validateOrderUpdateSupplier,
}

const supplier = {
    supplier_email: Joi.string()
        .email()
        .required(),
}

const user = {

    email: Joi.string()
        .email()
        .required(),

    phone_number: Joi.number()
        .required(),

    name: Joi.string()
        .required(),

    surname: Joi.string()
        .required(),

    street: Joi.string()
        .required(),

    street_number: Joi.string()
        .required(),

    city: Joi.string()
        .required(),

    zip_code: Joi.number()
        .required(),
}

const order = {

    is_accept_policy: Joi.boolean()
        .valid(true)
        .required(),

    type: Joi.string()
        .valid(...ORDER_TYPES),

    products: Joi.array()
        .items(
            Joi.object({

                amount: Joi.number()
                    .min(0)
                    .required(),

                unit: Joi.string()
                    .valid(...PRODUCT_UNITS)
                    .required(),

                description: Joi.string()
                    .required(),

            })
        ),

    note: Joi.string()
        .empty(''),

}

const createOrderRequest = {

    reCaptchaResponse: Joi.string()
        .required(),

    customer_timezone_offset: Joi.number(),

    customer_locale: Joi.string(),

}

const supplierUpdateOrderSchema = Joi.object({

    id: Joi.string(),

    updateToken: Joi.string()
        .required(),

    status: Joi.string()
        .valid(...ORDER_STATUS)
        .required(),

    estimated_deliverey: Joi.date(),

    supplier_timezone_offset: Joi.number(),

})

const orderUnregisteredUserSchema = Joi.object(order)
    .append(supplier)
    .append(user)
    .append(createOrderRequest)

function validationOptions (locale = 'de') {
    return {
        abortEarly: false,
        errors: {
            language: locale,
        }
    }
}

function validateOrder (data, locale = undefined) {
    const { value, error } = orderUnregisteredUserSchema.validate(data, validationOptions(locale))
    handleError(error)
    return value
}

function validateOrderUpdateSupplier (data, locale = undefined) {
    const { value, error } = supplierUpdateOrderSchema.validate(data, validationOptions(locale))
    handleError(error)
    return value
}

function handleError (error) {
    if (error) {
        error.type = ERROR_TYPE
        delete error._original
        throw error
    }
}