import * as firebase from 'firebase'

const auth = {
    signOut () {
        return firebase.auth().signOut()
    }
}

export default auth
