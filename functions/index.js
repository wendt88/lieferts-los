const functions = require('firebase-functions')
// const nodemailer = require('nodemailer')
const Firestore = require('@google-cloud/firestore')
const PROJECTID = 'bringr-io-dev'
const ORDERS = 'orders'

const firestore = new Firestore({
    projectId: PROJECTID,
    timestampsInSnapshots: true,
})

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'bringr@gmail.com',
//         pass: 'gubayelfpuhkachm'
//     }
// })

// const mailOptions = {
//     from: 'bringr@gmail.com',
//     to: 'danilo@kibun.io',
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
// }

// function sendMail () {
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log(error)
//         }
//         else {
//             console.log('Email sent: ' + info.response)
//         }
//     })
// }

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
    console.log('First logs')
    response.send('Hello from Flori!')
})

exports.order = functions.https.onRequest((request, response) => {
    if (request.method === 'POST') {
        // store/insert a new document
        console.log(request.body)
        let json = request.body instanceof String ? JSON.parse(request.body)
            : request.body instanceof Object ? request.body : {}
        json.created_at = new Date().getTime()
        return firestore.collection(ORDERS)
            .add(json)
            .then(doc => {
                return response.status(200).send(doc['_path'].segments[1])
            })
            .catch(err => {
                console.error(err)
                return response.status(404).send({ error: 'unable to store', err })
            })
        // sendMail();
    }
    else if (request.method === 'PUT') {
        return response.send('updatn mogsch??')
    }

    return response.send('GEA LERN AMOL WIA DE REQUESTS ZU MOCHN SEIN')
})

