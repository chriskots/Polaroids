import app from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
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
            messages: [],
            newMessages: [],
            notifications: [],
            friends: [],
            friendRequests: []
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
            this.usernameSearch.push({id: i, username: doc.data().username, profilePicture: doc.data().profilePicture});
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
          this.userProfile = {
            uid: doc.id,
            username: doc.data().username,
            profilePicture: doc.data().profilePicture,
            posts: doc.data().posts,
            newMessages: doc.data().newMessages,
            messages: doc.data().messages,
            notifications: doc.data().notifications,
            friends: doc.data().friends,
            friendRequests: doc.data().friendRequests
          };
        });
      });
    return this.userProfile;
  }

  // Remove notification function here
  async removeNotification(notification) {
    const userRef = doc(this.db, 'users', this.auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.data().notifications.includes(notification)) {
      await updateDoc(userRef, {
        notifications: arrayRemove(notification),
      });
    }
  }

  async sendFriendRequest(uid, username) {
    const userRef = doc(this.db, 'users', this.auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    const friendRef = doc(this.db, 'users', uid);

    if (userSnap.data().friendRequests.includes(username)) {
      await updateDoc(friendRef, {
        friends: arrayUnion(this.auth.currentUser.displayName),
        messages: arrayUnion({uid: this.auth.currentUser.uid, friend: this.auth.currentUser.displayName, messages: []}),
        newMessages: arrayUnion({uid: this.auth.currentUser.uid, friend: this.auth.currentUser.displayName, messages: []}),
        notifications: arrayUnion('Friend request accepted from: ' + this.auth.currentUser.displayName),
      });
      await updateDoc(userRef, {
        friends: arrayUnion(username),
        friendRequests: arrayRemove(username),
        messages: arrayUnion({uid: uid, friend: username, messages: []}),
        newMessages: arrayUnion({uid: uid, friend: username, messages: []}),
        notifications: arrayUnion('Added Friend: ' + username),
      });
    } else {
      await updateDoc(friendRef, {
        friendRequests: arrayUnion(this.auth.currentUser.displayName),
        notifications: arrayUnion('Friend request from: ' + this.auth.currentUser.displayName),
      });
    }
  }

  // {FuturePlans} make an efficient way to send notifications to your friends that you posted
  async createPost(image, rotation, title) {
    const todaysDate = new Date();
    const formattedMinutes = todaysDate.getMinutes().toString().padStart(2, '0');
    const postDate = todaysDate.getFullYear() + '-' + (todaysDate.getMonth() + 1) + '-' + todaysDate.getDate() + ': ' + todaysDate.getHours() + ':' + formattedMinutes;

    const post = {
      title: title,
      postDate: postDate,
      likes: [],
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
    
    const userRef = doc(this.db, 'users', this.auth.currentUser.uid);

    await updateDoc(userRef, {
      posts: arrayUnion(post),
    });
  }

  async changeProfilePicture(image) {
    let imageUrl = '';

    try {
      const uniqueId = uuidv4();
      const storageRef = ref(this.storage, `profiles/${uniqueId}-${image.name}`);
      const uploadTask = await uploadBytes(storageRef, image);

      imageUrl = await getDownloadURL(uploadTask.ref);
    } catch(error) {
      throw(error);
    }

    const userRef = doc(this.db, 'users', this.auth.currentUser.uid);
    
    await updateDoc(userRef, {
      profilePicture : imageUrl,
    });
  }

  async toggleLikePost(profileID, image) {
    const userRef = doc(this.db, 'users', profileID);
    const docSnap = await getDoc(userRef);
    const username = this.getCurrentUsername();
    let addUserNotification = true;
    
    if (docSnap.exists()) {
      const posts = docSnap.data().posts || [];

      const allPosts = posts.map((post) => {
        if (post.image !== image) {
          return post;
        }

        if (post.likes.includes(username)) {
          //When the user has liked the comment already and would like to remove it
          addUserNotification = false;
          return {
            ...post,
            likes: post.likes.filter((user) => user !== username),
          };
        } else {
          // When the user has not liked the comment yet
          return {
            ...post,
            likes: [...post.likes, username],
          };
        }
      });
      
      this.db.doc('users/' + profileID).update({ posts: allPosts });
      if (addUserNotification) {
        await updateDoc(userRef, {
          notifications: arrayUnion(username + ' has liked your post'),
        });
      } else {
        await updateDoc(userRef, {
          notifications: arrayRemove(username + ' has liked your post'),
        });
      }
    }
  }

  // Using Image as a unique identifier for the post that a comment is being made for
  async makeComment(profileID, image, text) {
    const todaysDate = new Date();
    const formattedMinutes = todaysDate.getMinutes().toString().padStart(2, '0');
    const commentDate = todaysDate.getFullYear() + '-' + (todaysDate.getMonth() + 1) + '-' + todaysDate.getDate() + ': ' + todaysDate.getHours() + ':' + formattedMinutes;

    const comment = {
      user: this.auth.currentUser.displayName,
      text: text,
      commentDate: commentDate,
      likes: []
    };

    const user = doc(this.db, 'users', profileID);
    const docSnap = await getDoc(user);

    if (docSnap.exists()) {
      const posts = docSnap.data().posts || [];

      const allPosts = posts.map((post) => 
        post.image === image ? {...post, comments: [...post.comments, comment]} : post
      );
      this.db.doc('users/' + profileID).update({ posts: allPosts });
      await updateDoc(user, {
        notifications: arrayUnion('Comment on your post by: ' + this.auth.currentUser.displayName),
      });
    }
  }

  async toggleLikeComment(profileID, image, commentIndex) {
    const docSnap = await getDoc(doc(this.db, 'users', profileID));
    const username = this.getCurrentUsername();

    if (docSnap.exists()) {
      const posts = docSnap.data().posts || [];

      const allPosts = posts.map((post) => {
        if (post.image !== image) {
          return post;
        }

        const updatedComments = post.comments.map((comment, i) => {
          if (i === commentIndex) {
            if (comment.likes.includes(username)) {
              //When the user has liked the comment already and would like to remove it
              return {
                ...comment,
                likes: comment.likes.filter((user) => user !== username),
              };
            } else {
              // When the user has not liked the comment yet
              return {
                ...comment,
                likes: [...comment.likes, username],
              };
            }
          }
          return comment;
        });

        return {
          ...post,
          comments: updatedComments,
        };
      });
      
      this.db.doc('users/' + profileID).update({ posts: allPosts });
    }
  }

  async sendMessage(friendUID, friendUsername, friendMessage) {
    const user = doc(this.db, 'users', friendUID);
    const docSnap = await getDoc(user);
    const username = this.getCurrentUsername();
    const userRef = doc(this.db, 'users', this.auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    const todaysDate = new Date();
    const formattedMinutes = todaysDate.getMinutes().toString().padStart(2, '0');
    const messageDate = todaysDate.getFullYear() + '-' + (todaysDate.getMonth() + 1) + '-' + todaysDate.getDate() + ': ' + todaysDate.getHours() + ':' + formattedMinutes;
    
    if (userSnap.exists()) {
      const messages = userSnap.data().messages || [];

      const allMessages = messages.map((message) => {
        if (message.friend !== friendUsername) {
          return message;
        }

        return {
          ...message,
          messages: [...message.messages, {username: username, message: friendMessage, date: messageDate}],
        }
      });

      await updateDoc(userRef, {
        messages: allMessages,
      });
    }

    if (docSnap.exists()) {
      const messages = docSnap.data().messages || [];

      const allMessages = messages.map((message) => {
        if (message.friend !== username) {
          return message;
        }

        return {
          ...message,
          messages: [...message.messages, {username: username, message: friendMessage, date: messageDate}],
        }
      });

      await updateDoc(user, {
        messages: allMessages,
      });
    }
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
