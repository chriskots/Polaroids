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
  }

  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
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

  isInitialized() {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged(resolve);
    });
  }

  getCurrentUsername() {
    return this.auth.currentUser && this.auth.currentUser.displayName;
  }
}

export default new Firebase();
