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
const createOrder = firebase.functions().httpsCallable('createOrder')
const updateOrder = firebase.functions().httpsCallable('updateOrder')

const COLLECTIONS = {
    ORDERS: 'orders',
    USERS: 'users',
}

const FIELDS = {
    USER_ID: 'user_id',
    SHOP_MAIL: 'shop_mail',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
}

const db = {
    async order (id) {
        const doc = (await firestore.collection(COLLECTIONS.ORDERS)
            .doc(id)
            .get())
            .data()
        doc.id = id
        return doc
    },
    async odersBySupplier (suppliermail) {
        return await firestore.collection(COLLECTIONS.ORDERS).where('supplier', '==', suppliermail)
            .get()
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
        let col = firestore.collection(COLLECTIONS.ORDERS)
            .where(FIELDS.USER_ID, '==', auth.currentUserId())
            .limit(limit)
            .orderBy(orderBy, orderDirection)
        for (const cond of where)
            col = col.where(cond.field, cond.operator, cond.value)
        if (lastDocument)
            col = col.startAfter(lastDocument[orderBy] || null)
        return (await col.get()).docs.map(d => ({ id: d.id, ...d.data() }))
    },
    async getOrdersForShop ({mail, lastDocument = null, limit = 10, orderBy = 'created_at', orderDirection = 'desc'}) {
        let col = firestore.collection(COLLECTIONS.ORDERS)
            .where(FIELDS.SHOP_MAIL, '==', mail)
            .limit(limit)
            .orderBy(orderBy, orderDirection)
        if (lastDocument)
            col = col.startAfter(lastDocument[orderBy] || null)
        return (await col.get()).docs.map(d => ({ id: d.id, ...d.data() }))
    },
    async saveOrder (data) {
        let res
        if (data.id) {
            res = await updateOrder({
                id: data.id,
                status: data.status,
                estimated_deliverey: data.estimated_deliverey,
                updateToken: data.updateToken,
            })
        }
        else {
            res = await createOrder(data)
        }
        data.id = res.id
        return data
    },
    async user () {
        const doc = (await firestore.collection(COLLECTIONS.USERS)
            .doc(auth.currentUserId())
            .get())
            .data()
        if (doc) {
            doc.id = auth.currentUserId()
        }
        return doc
    },
    async saveUser (data) {
        if (data.id) {
            data[FIELDS.UPDATED_AT] = new Date()
            await firestore.collection(COLLECTIONS.USERS)
                .doc(data.id)
                .update(data)
            return data
        }
        data[FIELDS.CREATED_AT] = new Date()
        await firestore.collection(COLLECTIONS.USERS)
            .doc(auth.currentUserId())
            .set(data)
        data.id = auth.currentUserId()
        return data
    },
    async findShop (email) {
        return (await firestore.collection(COLLECTIONS.USERS)
            .where('email', '==', email)
            .get())
            .docs.map(d => ({ id: d.id, ...d.data() }))
    },
    subscribe (collection, filter, fn) {
        firestore.collection(collection).where(filter)
            .onSnapshot((doc) => fn(doc))
    }
}

export default db