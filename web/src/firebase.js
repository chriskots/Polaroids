import app from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
    this.storage = getStorage();
    this.usernameMatch = false;
    this.usernameSearch = [];
    this.allUsernames = [];
    this.userProfile = null;
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
      .then((response) => {
        return this.db
          .collection('users')
          .doc(response.user.uid)
          .set({
            username: username,
            profilePicture: '',
            posts: [],
            friends: []
          });
      });
    return this.auth.currentUser.updateProfile({
      displayName: username,
    });
  }

  //Check username for creating a new user
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

  //Temp functionality for the search functionality (use something like .where('username', '==', username) to get users to reduce the size of the collection)
  async searchUsernames(username) {
    await this.db
      .collection('users')
      .get()
      .then((snapshot) => {
        let i = 0;
        snapshot.forEach((doc) => {
          if (doc.data().username.includes(username)) {
            this.usernameSearch.push({id: i, username: doc.data().username});
          }
          i += 1;
        });
      });
    return this.usernameSearch;
  }

  async getProfile(username) {
    await this.db
      .collection('users')
      .where('username', '==', username)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.userProfile = {username: doc.data().username, profilePicture: doc.data().profilePicture, posts: doc.data().posts, friends: doc.data().friends};
        });
      });
    return this.userProfile;
  }

  // Need to figure out the "Due to recent security improvements to Cloud Storage for Firebase, you must update your project settings." problem
  // It seems I need to re-link a bucket to my firebase account to access the GCP storage
  async createPost(image, title) {
    const post = {};
    post.title = title;
    post.date = new Date();
    try {
      const storageRef = ref(this.storage, `images/${image.name}`);
      const uploadTask = await uploadBytes(storageRef, image);

      const imageUrl = await getDownloadURL(uploadTask.ref);
      post.image = imageUrl;
    } catch(error) {
      throw(error);
    }
    
    const docSnap = await getDoc(doc(this.db, 'users', this.auth.currentUser.uid));
    const addPost = [...docSnap.data().posts, post];
    console.log(addPost);
    this.db.doc('users/' + this.auth.currentUser.uid).update({ posts: addPost });
    return false;
  }

  // create post function here
  // add to the posts array with an object

  // var today = new Date(),
  // todaysDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  // ex. {title: '', photo: '.pdf', description: '', date: todaysDate, likes: 0}

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
