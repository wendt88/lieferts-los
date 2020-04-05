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

exports.helloWorld = functions.https.onRequest((request, response) => {
    console.log('First logs')
    response.send('Hello from Flori!')
})

exports.orders = functions.https.onRequest(async (request, response) => {
    let data = typeof request.body === 'string' ? JSON.parse(request.body)
        : request.body instanceof Object ? request.body : {}

    try {

        if (request.method === 'POST') {
            data.created_at = new Date()

            const doc = await firestore.collection(ORDERS)
                .add(data)

            if (data.supplier_email) {
                await sendSupplierMail(data.supplier_email, doc.id)
            }

            return response.status(200)
                .send(doc.id)

        }

        else if (request.method === 'PUT') {
            const doc = await firestore.collection(ORDERS)
                .doc(data.id)
                .get()
            if (!doc || !doc.exists) {
                return response.status(404).send({ message: 'order not found' })
            }

            if (!data.updateToken || data.updateToken !== await getUpdateToken(doc.id)) {
                return response.status(400).send({ error: 'wrong updateToken' })
            }

            await doc.update({
                status: data.status,
                estimated_deliverey: data.estimated_deliverey,
            })

            return response.status(200)
        }

    }
    catch (err) {
        console.error(err)
        return response.status(500).send({ error: err })
    }

    return response.send('GEA LERN AMOL WIA DE REQUESTS ZU MOCHN SEIN')
})

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mailAccountName,
        pass: config.mailPassword
    }
})

function sendMail (mailOptions) {
    return transporter.sendMail(mailOptions)
}

function getUpdateToken (docId) {
    return crypto.createHash('sha256')
        .update(`${docId}${config.pepper}`)
        .digest('base64')
}

// Listens for new orders that are created and send a mail to the shop.
exports.createOrder = functions.firestore
    .document(`${ORDERS}/{docId}`)
    .onCreate((snap,) => {
        // Get an object representing the document
        const order = snap.data()
        const updateToken = getUpdateToken(snap.id)


        if (order.supplier_email) {
            const supplier = config.MAIL_ADDRESS //order.supplier_email
            const link = `https://localhost:1234/order/${snap.id}?update_token=${updateToken}`
            const mailOptions = {
                from: 'bringr@gmail.com',
                to: supplier,
                subject: 'New Order for you',
                text: `Link: ${link}`
            }
            console.log('About to send a mail')
            try {
                sendMail(mailOptions)
                console.log('Mail should arrive shortly')
            }
            catch (err) {
                console.log(err)
            }
        }
        else {
            console.log('no mail was provided')
        }
        return true
    })

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
