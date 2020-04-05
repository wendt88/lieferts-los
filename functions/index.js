const functions = require('firebase-functions')
const nodemailer = require('nodemailer')
const Firestore = require('@google-cloud/firestore')
const Crypto = require('crypto')
const Config = require('./config/config')
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

exports.order = functions.https.onRequest((request, response) => {
    if (request.method === 'POST') {
        // store/insert a new document
        try {
            let json = typeof request.body === 'string' ? JSON.parse(request.body)
                : request.body instanceof Object ? request.body : {}
            json.created_at = new Date()
            return firestore.collection(ORDERS)
                .add(json)
                .then(doc => {
                    return response.status(200).send(doc['_path'].segments[1])
                })
                .catch(err => {
                    console.error(err)
                    return response.status(404).send({ error: 'unable to store', err })
                })
        }
        catch (err) {
            console.error(err)
            return response.status(404).send({ error: 'unable to store', err })
        }
    }
    else if (request.method === 'PUT') {
        return response.send('updatn mogsch??')
    }

    return response.send('GEA LERN AMOL WIA DE REQUESTS ZU MOCHN SEIN')
})

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: Config.MAIL_ADDRESS,
        pass: Config.MAIL_PASS
    }
})

function sendMail (mailOptions) {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        }
        else {
            console.log('Email sent: ' + info.response)
        }
    })
}

function getUpdateToken (docId) {
    return Crypto.createHash('md5').update(`${Config.SALT}${docId}`)
        .digest('hex')
}

// Listens for new orders that are created and send a mail to the shop.
exports.createOrder = functions.firestore
    .document(`${ORDERS}/{docId}`)
    .onCreate((snap,) => {
        // Get an object representing the document
        const order = snap.data()
        const updateToken = getUpdateToken(snap.id)


        if (order.supplier_email) {
            const supplier = Config.MAIL_ADDRESS //order.supplier_email
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
