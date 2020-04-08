const functions = require('firebase-functions')
const nodemailer = require('nodemailer')
const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
const Firestore = require('@google-cloud/firestore')
const crypto = require('crypto')
const config = require('./config')

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

exports.createOrder = functions.https.onCall(async (data) => {
    data.created_at = new Date()

    const doc = await firestore.collection(ORDERS)
        .add(data)

    if (data.supplier_email) {
        await sendNewOrderMailForSupplier(data, doc.id)
    }
    if (data.email) {
        await sendNewOrderMailToCustomer(data, doc.id)
    }

    return { id: doc.id }
})

exports.updateOrder = functions.https.onCall(async (data) => {
    const doc = await firestore.collection(ORDERS)
        .doc(data.id)
        .get()
    if (!doc || !doc.exists) {
        throw new functions.https.HttpsError('order-not-found', 'order not found')
    }

    if (!data.updateToken || data.updateToken !== await getUpdateToken(doc.id)) {
        throw new functions.https.HttpsError('order-wrong-updateToken', 'wrong updateToken')
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

async function sendNewOrderMailForSupplier (data, docId) {
    const link = `https://${config.frontend_url_authority}/orders/${docId}?updateToken=${await getUpdateToken(docId)}`
    const mailOptions = {
        from: config.mailAccountName,
        to: data.supplier_email,
        subject: 'Eine neue Bestellung! Un nuovo ordine!',
        html: await getNewOrderForSupplierHtml(data, link),
        text: await getNewOrderForSupplierTxt(data, link)
    }
    await sendMail(mailOptions)
}

async function getNewOrderForSupplierHtml (data, link) {
    return replaceStringsInMail((await readFile('./mailTemplates/newOrderForSupplier.html', 'utf8')), data, link)
}

async function getNewOrderForSupplierTxt (data, link) {
    return replaceStringsInMail((await readFile('./mailTemplates/newOrderForSupplier.txt', 'utf8')), data, link)
}

async function sendNewOrderMailToCustomer (data, docId) {
    if (data.email) {
        const link = `https://${config.frontend_url_authority}/orders/${docId}`
        const mailOptions = {
            from: config.mailAccountName,
            to: data.email,
            subject: 'Die Bestellung wurde gesendet! L\'ordine è stato inviato!',
            html: await getNewOrderForCustomerHtml(data, link),
            text: await getNewOrderForCustomerTxt(data, link)
        }
        await sendMail(mailOptions)
    }
}

async function getNewOrderForCustomerHtml (data, link) {
    return replaceStringsInMail((await readFile('./mailTemplates/newOrderForCustomer.html', 'utf8')), data, link)
}

async function getNewOrderForCustomerTxt (data, link) {
    return replaceStringsInMail((await readFile('./mailTemplates/newOrderForCustomer.txt', 'utf8')), data, link)
}

function replaceStringsInMail (mail, data, link) {
    return mail.replace(/{{ name }}/gi, data.name)
        .replace(/{{ surname }}/gi, data.surname)
        .replace(/{{ linkToOrder }}/gi, link)
}