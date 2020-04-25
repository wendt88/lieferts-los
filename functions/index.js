const functions = require('firebase-functions')
const nodemailer = require('nodemailer')
const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
const Firestore = require('@google-cloud/firestore')
const crypto = require('crypto')
const config = require('./config')
const axios = require('axios')
const querystring = require('querystring')
const template = require('./template')

const PROJECTID = 'bringr-io-dev'
const ORDERS = 'orders'

const firestore = new Firestore({
    projectId: PROJECTID,
    timestampsInSnapshots: true,
})

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mailAccountName,
        pass: config.mailPassword
    }
})

async function validateReCaptcha (response) {
    const httpResponse = await axios.post(
        'https://recaptcha.google.com/recaptcha/api/siteverify',
        querystring.stringify({
            response,
            secret: config.reCaptchaSecret,
        }),
    )
    if (!httpResponse.data.success) {
        throw Error(`reCaptcha not valid ${JSON.stringify(httpResponse.data, null, 3)}`)
    }
    return httpResponse.data
}

exports.createOrder = functions.https.onCall(async (data) => {
    try {
        const reCaptchaResponse = data.reCaptchaResponse
        if (!reCaptchaResponse) {
            throw new functions.https.HttpsError('invalid-argument', 'reCaptchaResponse prop not contained in body')
        }

        try {
            await validateReCaptcha(reCaptchaResponse)
        }
        catch (e) {
            throw new functions.https.HttpsError('internal', `reCaptcha validation failed with error: ${e.message}`, e)
        }

        data.created_at = new Date()

        const doc = await firestore.collection(ORDERS)
            .add(data)
        const docID = doc.id
        const orderPositions = await getOrderPositionsMailTexts(data)

        if (data.supplier_email) {
            await sendNewOrderMailForSupplier(data, docID, orderPositions)
        }
        if (data.email) {
            await sendNewOrderMailToCustomer(data, docID, orderPositions)
        }
        return { id: docID }
    }
    catch (e) {
        if (e instanceof functions.https.HttpsError) {
            throw e
        }
        throw new functions.https.HttpsError('internal', `error while creating order: ${e.message}`, e)
    }
})

exports.updateOrder = functions.https.onCall(async (data) => {
    try {
        const doc = await firestore.collection(ORDERS)
            .doc(data.id)
            .get()
        if (!doc || !doc.exists) {
            throw new functions.https.HttpsError('not-found', 'order not found')
        }

        if (!data.updateToken || data.updateToken !== await getUpdateToken(doc.id)) {
            throw new functions.https.HttpsError('permission-denied', 'wrong updateToken')
        }

        const update = {
            status: data.status,
            estimated_deliverey: data.estimated_deliverey,
        }
        await firestore.collection(ORDERS)
            .doc(data.id)
            .update(update)

        let isUpdateMailSent = false
        let mailError = undefined
        try {
            await sendUpdateOrderMailToCustomer({ ...doc.data(), ...update }, doc.id)
            isUpdateMailSent = true
        }
        catch (e) {
            mailError = e
        }

        return {
            id: doc.id,
            isUpdateMailSent,
            mailError,
        }
    }
    catch (e) {
        if (e instanceof functions.https.HttpsError) {
            throw e
        }
        throw new functions.https.HttpsError('internal', `error while updating order: ${e.message}`, e)
    }
})

function sendMail (mailOptions) {
    return transporter.sendMail(mailOptions)
}

function getUpdateToken (docId) {
    return crypto.createHash('sha256')
        .update(`${docId}${config.pepper}`)
        .digest('hex')
}

async function getOrderLinkSupplier (docId) {
    return `https://${config.frontendURLAuthority}/orders/${docId}?updateToken=${await getUpdateToken(docId)}`
}

function getOrderLinkCustomer (docId) {
    return `https://${config.frontendURLAuthority}/orders/${docId}`
}

async function sendUpdateOrderMailToCustomer (data, docId) {
    const link = getOrderLinkCustomer(docId)
    data = prepareUpdateOrderForSupplierData(data, link)
    const mailOptions = {
        from: config.mailAccountName,
        to: data.email,
        subject: 'Ihre Bestellung wurde aktualisiert! Il tuo ordine è stato aggiornato!',
        html: await getUpdateOrderForSupplierHtml(data, link),
        text: await getUpdateOrderForSupplierTxt(data, link),
        replyTo: data.supplier_email,
    }
    await sendMail(mailOptions)
}

function prepareUpdateOrderForSupplierData (data, link) {
    data.linkToOrder = link
    data = translateOrderStatus(data)
    data.estimated_deliverey = getDateString(new Date(data.estimated_deliverey), data.customer_timezone_offset, data.customer_locale)
    return data
}

async function getUpdateOrderForSupplierHtml (data) {
    let string = await readFile('./mailTemplates/updateOrderForCustomer.html', 'utf8')
    return template.replaceTags(string, data)
}

async function getUpdateOrderForSupplierTxt (data) {
    let string = await readFile('./mailTemplates/updateOrderForCustomer.txt', 'utf8')
    return template.replaceTags(string, data)
}

async function sendNewOrderMailForSupplier (data, docId, orderPos) {
    const link = await getOrderLinkSupplier(docId)
    const mailOptions = {
        from: config.mailAccountName,
        to: data.supplier_email,
        subject: 'Eine neue Bestellung! Un nuovo ordine!',
        html: await getNewOrderForSupplierHtml(data, link, orderPos),
        text: await getNewOrderForSupplierTxt(data, link, orderPos)
    }
    if (data.email) {
        mailOptions.replyTo = data.email
    }
    await sendMail(mailOptions)
}

async function getNewOrderForSupplierHtml (data, link, orderPos) {
    return replaceStringsInMail((await readFile('./mailTemplates/newOrderForSupplier.html', 'utf8')), data, link, orderPos.html)
}

async function getNewOrderForSupplierTxt (data, link, orderPos) {
    return replaceStringsInMail((await readFile('./mailTemplates/newOrderForSupplier.txt', 'utf8')), data, link, orderPos.text)
}

async function sendNewOrderMailToCustomer (data, docId, orderPos) {
    if (data.email) {
        const link = getOrderLinkCustomer(docId)
        const mailOptions = {
            from: config.mailAccountName,
            to: data.email,
            subject: 'Die Bestellung wurde gesendet! L\'ordine è stato inviato!',
            html: await getNewOrderForCustomerHtml(data, link, orderPos),
            text: await getNewOrderForCustomerTxt(data, link, orderPos)
        }
        await sendMail(mailOptions)
    }
}

async function getNewOrderForCustomerHtml (data, link, orderPos) {
    return replaceStringsInMail((await readFile('./mailTemplates/newOrderForCustomer.html', 'utf8')), data, link, orderPos.html)
}

async function getNewOrderForCustomerTxt (data, link, orderPos) {
    return replaceStringsInMail((await readFile('./mailTemplates/newOrderForCustomer.txt', 'utf8')), data, link, orderPos.text)
}

function replaceStringsInMail (mail, data, link, orderPos) {
    data = Object.assign({}, data)
    data.linkToOrder = link
    data.orderPositions = orderPos
    data.created_at = getDateString(data.created_at, data.customer_timezone_offset, data.customer_locale)
    data.type = getTypeOfOrder(data.type)
    return template.replaceTags(mail, data)
}

async function getOrderPositionsMailTexts (data) {
    const singleOrderPosHtml = await readFile('./mailTemplates/orderPosTableRowHtml.txt', 'utf8')
    const singleOrderPosTxt = await readFile('./mailTemplates/orderPosTableRowTxt.txt', 'utf8')
    var composedHtml = ''
    var composedTxt = ''

    const products = data.products
    if (products) {
        for (var i = 0; i < products.length; i++) {
            var p = products[i]
            const unit = getUnitForMail(p.unit)

            var orderPosHtml = singleOrderPosHtml.replace(/{{ quantity }}/gi, p.amount)
                .replace(/{{ unit }}/gi, unit)
                .replace(/{{ article }}/gi, p.description)
            if (i%2 == 0)
                orderPosHtml = orderPosHtml.replace(/{{ background-color }}/, 'background-color: rgb(221, 221, 221);')
            composedHtml = `${composedHtml}${orderPosHtml}`

            var orderPosTxt = singleOrderPosTxt.replace(/{{ quantity }}/gi, p.amount)
                .replace(/{{ unit }}/gi, unit)
                .replace(/{{ article }}/gi, p.description)
            composedTxt = `${composedTxt}${orderPosTxt}`
        }
    }

    return {
        html: composedHtml,
        text: composedTxt
    }
}

function getDateString (date, timezoneOffset = date.getTimezoneOffset(), locale = 'de') {
    return new Date(
        date.getTime()
        - (timezoneOffset * 60000)
    )
        .toLocaleString(locale)
}

function getTypeOfOrder (type) {
    switch (type) {
        case 'collection':
            return 'Abholung von/Ritiro da'
        default:
            return 'Lieferung an/Consegna a'
    }
}

function getUnitForMail (unit) {
    switch (unit) {
        case 'pieces':
            return 'Stk./Pz.'
        default:
            return unit
    }
}

function translateOrderStatus (data) {
    let translation = {}
    switch (data.status) {
        case 'unrecognized':
            translation = {
                status_de: 'Noch nicht erfasst',
                status_it: 'Non registrato',
            }
            break
        case 'accepted':
            translation = {
                status_de: 'Angenommen',
                status_it: 'Accettato',
            }
            break
        case 'processing':
            translation = {
                status_de: 'In Bearbeitung',
                status_it: 'In elaborazione',
            }
            break
        case 'done':
            translation = {
                status_de: 'Erledigt',
                status_it: 'Chiuso',
            }
            break
        case 'rejected':
            translation = {
                status_de: 'Abgelehnt',
                status_it: 'Rifiutato',
            }
            break
    }
    return Object.assign(data, translation)
}
