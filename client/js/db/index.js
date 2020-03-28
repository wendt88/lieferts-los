import * as firebase from 'firebase'

const firebaseConfig = {
    apiKey: 'AIzaSyDNOkG57a_ZYl8qbwn5YMSIO9BGjbwHkFU',
    authDomain: 'bringr-io-dev.firebaseapp.com',
    databaseURL: 'https://bringr-io-dev.firebaseio.com',
    projectId: 'bringr-io-dev',
    storageBucket: 'bringr-io-dev.appspot.com',
    messagingSenderId: '103924518486',
    appId: '1:103924518486:web:40cc6fd2c7c822f903b5f7',
    measurementId: 'G-T64131CJ15'
}

firebase.initializeApp(firebaseConfig)

const firestore = firebase.firestore()
const COLLECTIONS = {
    ORDERS: 'orders',
}

const db = {
    async order (documentPath) {
        const doc = await firestore.collection(COLLECTIONS.ORDERS)
            .doc(documentPath)
        return doc
    },
    async createOrder (orderData) {
        const docRef = await firestore.collection(COLLECTIONS.ORDERS)
            .add(orderData)
        return { ...orderData, ...docRef }
    }
}

export default db