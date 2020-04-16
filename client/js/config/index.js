
const defaults = {
    firebase: {
        apiKey: 'AIzaSyDNOkG57a_ZYl8qbwn5YMSIO9BGjbwHkFU',
        authDomain: 'bringr-io-dev.firebaseapp.com',
        databaseURL: 'https://bringr-io-dev.firebaseio.com',
        projectId: 'bringr-io-dev',
        storageBucket: 'bringr-io-dev.appspot.com',
        messagingSenderId: '103924518486',
        appId: '1:103924518486:web:40cc6fd2c7c822f903b5f7',
        measurementId: 'G-T64131CJ15'
    },
    reCaptchaSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
}

let config = {}
try {
    config = require('./config.js')
}
catch {}

module.exports = Object.assign(defaults, config)
