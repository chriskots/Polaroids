import app from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

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
    this.usernameSearch = [];
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
      //Change this to be contains instead of ==
      //Find a way to use array-contains-any
      .where('username', '==', username)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.usernameSearch.push({id: 0, username: doc.data().username});
        });
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
          this.allUsernames.push(doc.data().username);
        });
      });
    return this.allUsernames;
  }
}

// eslint-disable-next-line
export default new Firebase();
