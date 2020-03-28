import * as firebase from 'firebase'
import auth from '../auth'

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
    STOCK: 'stock',
    SUPPLIERS: 'suppliers',
    USER_PROFILES: 'user_profiles',
}

const FIELDS = {
    USER_ID: 'user_id'
}

const db = {
    async order (id) {
        const doc = (await firestore.collection(COLLECTIONS.ORDERS)
            .doc(id)
            .get())
            .data()
        return doc
    },
    async odersBySupplier (supplierMail) {
        return await firestore.collection(COLLECTIONS.ORDERS).where('supplier', '==', supplierMail)
    },
    /**
     * query orders
     * @param {Array<Object>} where Array of objects of the form { field: 'pathOfFieldToQuery', operator: '==', value: 'valueToCompare' } https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#where
     * @param {Object} lastDocument the last document of the previous fetched list in order to display only documents after the one handed in
     * @param {Integer} limit number of documents to extract
     * @param {String} orderBy path of field
     * @param {String} orderDirection
     */
    async queryOrders ({where = [], lastDocument = null, limit = 10, orderBy = 'created_at', orderDirection = 'desc'}) {
        const col = firestore.collection(COLLECTIONS.ORDERS)
        col.where(FIELDS.USER_ID, '==', auth.currentUserId())
        for (const cond of where) {
            col.where(cond.field, cond.operator, cond.value)
        }
        if (lastDocument) {
            col.startAfter(lastDocument[orderBy] || null)
        }
        col.limit(limit)
        col.orderBy(orderBy, orderDirection)
        return (await col.get()).docs.map(d => ({ id: d.id, ...d.data() }))
    },
    async saveOrder (orderData) {
        if (orderData.id) {
            await firestore.collection(COLLECTIONS.ORDERS)
                .doc(orderData.id)
                .update(orderData)
            return orderData
        }
        orderData.created_at = new Date()
        orderData[FIELDS.USER_ID] = auth.currentUserId()
        const docRef = await firestore.collection(COLLECTIONS.ORDERS)
            .add(orderData)
        orderData.id = docRef.id
        return orderData
    },
    async saveUserProfile (data) {
        if (data.id) {
            data.updated_at = new Date()
            await firestore.collection(COLLECTIONS.USER_PROFILES)
                .doc(data.id)
                .update(data)
            return data
        }
        data.created_at = new Date()
        data.user_id = auth.currentUserId()
        const docRef = await firestore.collection(COLLECTIONS.USER_PROFILES)
            .add(data)
        data.id = docRef.id
        return data
    },
    subscribe (collection, filter, fn) {
        firestore.collection(collection).where(filter)
            .onSnapshot((doc) => fn(doc))
    }
}

export default db