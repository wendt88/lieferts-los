import * as firebase from 'firebase'

const auth = {
    currentUserId () {
        return firebase.auth().currentUserId
    },
    signOut () {
        return firebase.auth().signOut()
    }
}

export default auth
