import { all, take, takeLatest, put, select } from "@redux-saga/core/effects";
import { eventChannel } from "redux-saga";
import {
  sagaGetFeeds,
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

export function* getFeeds() {
  const userId = yield select((state) => state.userReducer.userId);
  let documents = [];
  const querySnapshot = yield FIREBASE.getFeeds(userId);
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
  const userId = yield select((state) => state.profileReducer.userId);

  const followersResponse = yield FIREBASE.getFollowers(userId, action.payload);

  followersResponse.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() });
  });

  yield put(setFollowers({ followersList: docs, isLoading: false }));
}

export function* getFollowing(action) {
  let docs = [];
  const userId = yield select((state) => state.profileReducer.userId);

  const followingResponse = yield FIREBASE.getFollowing(userId, action.payload);

  followingResponse.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() });
  });

  yield put(setFollowing({ followingList: docs, isLoading: false }));
}

export function* getAllUsers() {
  let users = [];
  const userId = yield select((state) => state.userReducer.userId);

  const allUsersResponse = yield FIREBASE.getAllUsers();

  allUsersResponse.forEach((doc) => {
    if (doc.id !== userId) {
      users.push({ ...doc.data(), id: doc.id });
    }
  });

  const ref = firestore.collection("users").doc(userId).collection("following");
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
  const userId = yield select((state) => state.userReducer.userId);

  yield FIREBASE.startFollowing(
    userId,
    action.payload.id,
    action.payload.displayName
  );
}

export function* unfollowUser(action) {
  const userId = yield select((state) => state.userReducer.userId);

  yield FIREBASE.startUnfollowing(userId, action.payload.id);
}

export function* toggleLike(action) {
  const userId = yield select((state) => state.userReducer.userId);
  const { postId, ownerId, likes, likeStatus } = action.payload;

  if (likeStatus) {
    yield FIREBASE.like(userId, postId, ownerId, likes);
  } else {
    yield FIREBASE.removeLike(userId, postId, ownerId, likes);
  }

  yield put(sagaGetFeeds(userId));
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
