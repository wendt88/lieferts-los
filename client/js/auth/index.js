import * as firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';

const auth = {
    currentUserId () {
        return firebase.auth().currentUser.uid
    },
    currentUserMail () {
        return firebase.auth().currentUser.email
    },
    createUserWithEmailAndPassword (form) {
        firebase
            .auth()
            .createUserWithEmailAndPassword(form.email, form.password)
            .then(data => {
                data.user
                    .updateProfile({
                        displayName: form.name
                    })
                    .then(() => {})
                firebase.firestore()
                    .collection('users')
                    .doc(data.user.uid)
                    .set({
                        'shop-owner': form.shopOwner,
                        company: form.company
                    })
            })
            .catch(err => {
                this.error = err.message
            })
    },
    signOut () {
        return firebase.auth().signOut()
    }
}

export default auth
