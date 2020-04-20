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
})

exports.updateOrder = functions.https.onCall(async (data) => {
    const doc = await firestore.collection(ORDERS)
        .doc(data.id)
        .get()
    if (!doc || !doc.exists) {
        throw new functions.https.HttpsError('not-found', 'order not found')
    }

    if (!data.updateToken || data.updateToken !== await getUpdateToken(doc.id)) {
        throw new functions.https.HttpsError('permission-denied', 'wrong updateToken')
    }

    await firestore.collection(ORDERS)
        .doc(data.id)
        .update({
            status: data.status,
            estimated_deliverey: data.estimated_deliverey,
        })

    return { id: doc.id }
})

function sendMail (mailOptions) {
    return transporter.sendMail(mailOptions)
}

function getUpdateToken (docId) {
    return crypto.createHash('sha256')
        .update(`${docId}${config.pepper}`)
        .digest('hex')
}

async function sendNewOrderMailForSupplier (data, docId, orderPos) {
    const link = `https://${config.frontenURLAuthority}/orders/${docId}?updateToken=${await getUpdateToken(docId)}`
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
        const link = `https://${config.frontenURLAuthority}/orders/${docId}`
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
    return mail.replace(/{{ name }}/gi, data.name)
        .replace(/{{ surname }}/gi, data.surname)
        .replace(/{{ created_at }}/gi, getDateString(data.created_at))
        .replace(/{{ type }}/gi, getTypeOfOrder(data.type))
        .replace(/{{ street }}/gi, data.street || '')
        .replace(/{{ street_number }}/gi, data.street_number || '')
        .replace(/{{ zip_code }}/gi, data.zip_code || '')
        .replace(/{{ city }}/gi, data.city || '')
        .replace(/{{ phone_number }}/gi, data.phone_number || '')
        .replace(/{{ email }}/gi, data.email || '')
        .replace(/{{ linkToOrder }}/gi, link)
        .replace(/{{ orderPositions }}/gi, orderPos)
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

function getDateString (date) {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .split('T')[0]
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
