import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-firestore';

const config = {
  apiKey: 'AIzaSyAEMo75DYkIX1nQg8WNeoLaKLhTu3JGjuQ',
  authDomain: 'polaroids-firebase.firebaseapp.com',
  databaseURL: 'https://polaroids-firebase.firebaseio.com',
  projectId: 'polaroids-firebase',
  storageBucket: 'polaroids-firebase.appspot.com',
  messagingSenderId: '876964959755',
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
    this.usernameMatch = false;
    this.usernameSearch = '';
    this.allUsernames = [];
  }

  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  passwordReset(email) {
    return this.auth.sendPasswordResetEmail(email);
  }

  async register(username, email, password) {
    await this.auth
      .createUserWithEmailAndPassword(email, password)
      .then((resp) => {
        return this.db
          .collection('users')
          .doc(resp.user.uid)
          .set({
            username: username,
          });
      });
    return this.auth.currentUser.updateProfile({
      displayName: username,
    });
  }

  async checkUsername(username) {
    await this.db
      .collection('users')
      .where('username', '==', username)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          this.usernameMatch = true;
        } else {
          this.usernameMatch = false;
        }
      });
    return this.usernameMatch;
  }

  //Use algolia to do fulltext searches for username searches to be dynamic to what the user types
  async searchUsernames(username) {
    await this.db
      .collection('users')
      .where('username', '==', username)
      .get()
      .then((snapshot) => {
        try {
          this.usernameSearch =
            snapshot.docs[0].lm.Ee.proto.mapValue.fields.username.stringValue;
        } catch (err) {
          this.usernameSearch = '';
        }
      });
    return this.usernameSearch;
  }

  isInitialized() {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged(resolve);
    });
  }

  getCurrentUsername() {
    return this.auth.currentUser && this.auth.currentUser.displayName;
  }

  async getAllUsernames() {
    await this.db
      .collection('users')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.allUsernames.push(
            doc.lm.Ee.proto.mapValue.fields.username.stringValue
          );
        });
      });
    return this.allUsernames;
  }
}

export default new Firebase();
