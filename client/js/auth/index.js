import * as firebase from 'firebase'

const auth = {
    currentUserId () {
        return firebase.auth().currentUser.uid
    },
    signOut () {
        return firebase.auth().signOut()
    }
}

export default auth
