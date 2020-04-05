const functions = require('firebase-functions')
const nodemailer = require('nodemailer')
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
        await sendSupplierMail(data.supplier_email, doc.id)
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

    await doc.update({
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
        .digest('base64')
}

async function sendSupplierMail (mail, id) {
    const link = `https://${config.frontend_url_authority}/orders/${id}?updateToken=${await getUpdateToken(id)}`
    const mailOptions = {
        from: config.mailAccountName,
        to: mail,
        subject: 'New Order for you',
        text: `Link: ${link}`
    }
    await sendMail(mailOptions)
}
