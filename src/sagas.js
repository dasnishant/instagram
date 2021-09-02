import { all, take, takeLatest, put } from "@redux-saga/core/effects";
import { eventChannel } from "redux-saga";
import {
  setAllUsers,
  setError,
  setFeeds,
  setFollowers,
  setFollowing,
  setProfile,
  userLogIn,
  userSignUp,
} from "./actions";
import { firestore } from "./firebase/config";
import FIREBASE from "./firebase/utils";

export function* logIn(action) {
  const { email, password, history } = action.payload;
  try {
    const response = yield FIREBASE.logIn(email, password);
    const userResponse = yield FIREBASE.getUser(response.user.uid);
    console.log(userResponse.data().displayName);
    yield put(
      userSignUp({
        userId: response.user.uid,
        email,
        displayName: userResponse.data().displayName,
      })
    );
    yield history.replace("/");
  } catch (error) {
    console.log(error.code.split("/")[1]);
    yield put(setError(error.code.split("/")[1]));
  }
}

export function* signUp(action) {
  const { email, password, displayName, history } = action.payload;
  try {
    const response = yield FIREBASE.signUp(email, password);
    yield put(userLogIn({ userId: response.user.uid, email, displayName }));
    yield FIREBASE.setUser(response.user.uid, displayName);
    history.replace("/");
  } catch (error) {
    console.log(error.code.split("/")[1]);
    yield put(setError(error.code.split("/")[1]));
  }
}

export function* getFeeds(action) {
  let documents = [];
  const querySnapshot = yield FIREBASE.getFeeds(action.payload);
  let posts = querySnapshot.data().postsRef;
  for (let postRef of posts) {
    let post = yield postRef.get();
    documents.push({
      ...post.data(),
      id: post.id,
      ownerId: postRef.path.split("/")[1],
    });
  }
  yield put(setFeeds({ feeds: documents, isLoading: false }));
}

export function* getProfile(action) {
  const profileDataResponse = yield FIREBASE.getProfile(action.payload);
  const profilePostsResponse = yield FIREBASE.getProfilePosts(action.payload);
  let postsDoc = [];
  profilePostsResponse.docs.forEach((post) =>
    postsDoc.push({ ...post.data(), id: post.id })
  );

  yield put(
    setProfile({
      isLoading: false,
      userId: action.payload,
      posts: postsDoc,
      ...profileDataResponse.data(),
    })
  );
}

export function* getFollowers(action) {
  let docs = [];

  const followersResponse = yield FIREBASE.getFollowers(
    action.payload.userId,
    action.payload.showModal
  );

  followersResponse.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() });
  });

  yield put(setFollowers({ followersList: docs, isLoading: false }));
}

export function* getFollowing(action) {
  let docs = [];

  const followingResponse = yield FIREBASE.getFollowing(
    action.payload.userId,
    action.payload.showModal
  );

  followingResponse.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() });
  });

  yield put(setFollowing({ followingList: docs, isLoading: false }));
}

export function* getAllUsers(action) {
  let users = [];
  const allUsersResponse = yield FIREBASE.getAllUsers();

  allUsersResponse.forEach((doc) => {
    if (doc.id !== action.payload) {
      users.push({ ...doc.data(), id: doc.id });
    }
  });

  const ref = firestore
    .collection("users")
    .doc(action.payload)
    .collection("following");
  const channel = eventChannel((emit) => ref.onSnapshot(emit));

  while (true) {
    const data = yield take(channel);
    yield put(
      setAllUsers({
        isLoading: false,
        following: data.docs.map((doc) => doc.id),
        allUsers: users,
      })
    );
  }
}

export function* followUser(action) {
  yield FIREBASE.startFollowing(
    action.payload.id,
    action.payload.user.id,
    action.payload.user.displayName
  );
}

export function* unfollowUser(action) {
  yield FIREBASE.startUnfollowing(action.payload.id, action.payload.user.id);
}

export function* toggleLike(action) {
  const { userId, postId, ownerId, likes, feeds, likeStatus } = action.payload;

  if (likeStatus) {
    yield FIREBASE.like(userId, postId, ownerId, likes);
  } else {
    yield FIREBASE.removeLike(userId, postId, ownerId, likes);
  }

  const postRef = firestore
    .collection("users")
    .doc(ownerId)
    .collection("posts")
    .doc(postId);
  const channel = eventChannel((emit) => postRef.onSnapshot(emit));

  while (true) {
    let docs = [];
    const post = yield take(channel);
    let ownerId = post.ref.path.split("/")[1];
    docs = feeds.map((doc) => {
      if (doc.id === post.id) {
        console.log(post.data());
        return { ...post.data(), id: post.id, ownerId };
      } else {
        return doc;
      }
    });
    yield put(setFeeds({ feeds: docs, isLoading: false }));
  }
}

export function* watchAllAction() {
  yield takeLatest("SAGA_USER_LOG_IN", logIn);
  yield takeLatest("SAGA_USER_SIGN_UP", signUp);
  yield takeLatest("SAGA_GET_FEEDS", getFeeds);
  yield takeLatest("SAGA_GET_PROFILE", getProfile);
  yield takeLatest("SET_SAGA_FOLLOWERS", getFollowers);
  yield takeLatest("SET_SAGA_FOLLOWING", getFollowing);
  yield takeLatest("SET_SAGA_ALL_USERS", getAllUsers);
  yield takeLatest("SAGA_FOLLOW", followUser);
  yield takeLatest("SAGA_UNFOLLOW", unfollowUser);
  yield takeLatest("SAGA_TOGGLE_LIKE", toggleLike);
}

export function* rootSaga() {
  yield all([watchAllAction()]);
}
