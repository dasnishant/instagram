import { firebaseAuth, firestore } from "./config";

const FIREBASE = {
  logIn: (email, password) => {
    return firebaseAuth.signInWithEmailAndPassword(email, password);
  },

  getUser: (userId) => {
    return firestore.collection("users").doc(userId).get();
  },

  signUp: (email, password) => {
    return firebaseAuth.createUserWithEmailAndPassword(email, password);
  },

  setUser: (id, displayName) => {
    return firestore
      .collection("users")
      .doc(id)
      .set({ displayName: displayName, followers: 0, following: 0 });
  },

  getFeeds: (userId) => {
    return firestore.collection("feeds").doc(userId).get();
  },

  getProfile: (profileId) => {
    return firestore.collection("users").doc(profileId).get();
  },

  getProfilePosts: (profileId) => {
    return firestore
      .collection("users")
      .doc(profileId)
      .collection("posts")
      .get();
  },

  getFollowers: (profileId, showModal) => {
    return firestore
      .collection("users")
      .doc(profileId)
      .collection(showModal)
      .get();
  },

  getFollowing: (profileId, showModal) => {
    return firestore
      .collection("users")
      .doc(profileId)
      .collection(showModal)
      .get();
  },

  getAllUsers: () => {
    return firestore.collection("users").get();
  },

  getUserFollowing: (userId) => {
    return firestore
      .collection("users")
      .doc(userId)
      .collection("following")
      .get();
  },

  startFollowing: (id, userId, displayName) => {
    return firestore
      .collection("users")
      .doc(id)
      .collection("following")
      .doc(userId)
      .set({ displayName });
  },

  startUnfollowing: (id, userId) => {
    return firestore
      .collection("users")
      .doc(id)
      .collection("following")
      .doc(userId)
      .delete();
  },

  like: (userId, postId, ownerId, likes) => {
    return firestore
      .collection("users")
      .doc(ownerId)
      .collection("posts")
      .doc(postId)
      .update({ likes: [...likes, userId] });
  },
  removeLike: (userId, postId, ownerId, likes) => {
    return firestore
      .collection("users")
      .doc(ownerId)
      .collection("posts")
      .doc(postId)
      .update({ likes: likes.filter((id) => id !== userId) });
  },
};

export default FIREBASE;
