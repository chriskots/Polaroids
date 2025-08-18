import app from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

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
          this.userProfile = {uid: doc.id, username: doc.data().username, profilePicture: doc.data().profilePicture, posts: doc.data().posts, friends: doc.data().friends};
        });
      });
    return this.userProfile;
  }

  async createPost(image, rotation, title) {
    const todaysDate = new Date();
    const postDate = todaysDate.getFullYear() + '-' + (todaysDate.getMonth() + 1) + '-' + todaysDate.getDate();

    const post = {
      title: title,
      postDate: postDate,
      likes: 0,
      comments: [],
      rotation: rotation,
    };

    try {
      const uniqueId = uuidv4();
      const storageRef = ref(this.storage, `images/${uniqueId}-${image.name}`);
      const uploadTask = await uploadBytes(storageRef, image);

      const imageUrl = await getDownloadURL(uploadTask.ref);
      post.image = imageUrl;
    } catch(error) {
      throw(error);
    }
    
    const docSnap = await getDoc(doc(this.db, 'users', this.auth.currentUser.uid));
    const addPost = [...docSnap.data().posts, post];
    this.db.doc('users/' + this.auth.currentUser.uid).update({ posts: addPost });
  }

  // Using Image as a unique identifier for the post that a comment is being made for
  async makeComment(profileID, image, text) {
    const todaysDate = new Date();
    const commentDate = todaysDate.getFullYear() + '-' + (todaysDate.getMonth() + 1) + '-' + todaysDate.getDate() + ': ' + todaysDate.getHours() + ':' + todaysDate.getMinutes();

    const comment = {
      user: this.auth.currentUser.displayName,
      text: text,
      commentDate: commentDate,
      likes: 0
    };

    const docSnap = await getDoc(doc(this.db, 'users', profileID));

    let retPost = {}
    for (let post in docSnap.data().posts) {
      if (docSnap.data().posts[post].image === image) {
        retPost = docSnap.data().posts[post]
        const newComments = [...retPost.comments, comment];
        retPost.comments = newComments;
        // {ToDo} Find a way to just update the post that is at post index
        console.log(retPost);

      }
    }

    // Make comment functionality here
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
