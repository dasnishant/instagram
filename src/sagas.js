import { all, takeLatest, put, select } from "@redux-saga/core/effects";
// import { eventChannel } from "redux-saga";
import {
  sagaGetFeeds,
  setAllUsers,
  setError,
  setFeeds,
  setFollowers,
  setFollowing,
  setProfile,
  setSagaAllUsers,
  userLogIn,
  // userSignUp,
} from "./actions";
import FIREBASE from "./firebase/utils";
import mockApi, { getUrl } from "./mockAPI";
import {
  ALL_USERS_URL,
  AUTH_URL,
  FEEDS_URL,
  PROFILE_FOLLOWERS_URL,
  PROFILE_FOLLOWING_URL,
  PROFILE_POSTS_URL,
  PROFILE_URL,
} from "./urlConfig";

export function* logIn(action) {
  const { history } = action.payload;
  const authResponse = yield mockApi(getUrl(AUTH_URL), "GET");
  yield put(userLogIn({ ...authResponse }));
  yield history.replace("/");
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
  const feeds = yield mockApi(getUrl(FEEDS_URL), "GET");
  yield put(setFeeds({ feeds, isLoading: false }));
}

export function* getProfile() {
  const profile = yield mockApi(getUrl(PROFILE_URL), "GET");
  const profilePosts = yield mockApi(getUrl(PROFILE_POSTS_URL), "GET");

  yield put(
    setProfile({
      isLoading: false,
      posts: profilePosts,
      ...profile,
    })
  );
}

export function* getFollowers() {
  const followersList = yield mockApi(getUrl(PROFILE_FOLLOWERS_URL), "GET");
  yield put(setFollowers({ followersList, isLoading: false }));
}

export function* getFollowing() {
  const followingList = yield mockApi(getUrl(PROFILE_FOLLOWING_URL), "GET");
  yield put(setFollowing({ followingList, isLoading: false }));
}

export function* getAllUsers() {
  // let users = [];
  // const userId = yield select((state) => state.userReducer.userId);

  // const allUsersResponse = yield FIREBASE.getAllUsers();

  // allUsersResponse.forEach((doc) => {
  //   if (doc.id !== userId) {
  //     users.push({ ...doc.data(), id: doc.id });
  //   }
  // });

  // const ref = firestore.collection("users").doc(userId).collection("following");
  // const channel = eventChannel((emit) => ref.onSnapshot(emit));

  // while (true) {
  //   const data = yield take(channel);
  //   yield put(
  //     setAllUsers({
  //       isLoading: false,
  //       following: data.docs.map((doc) => doc.id),
  //       allUsers: users,
  //     })
  //   );
  // }

  const userId = yield select((state) => state.userReducer.userId);
  const allUsers = yield mockApi(getUrl(ALL_USERS_URL), "GET");
  const followingList = yield mockApi(getUrl(PROFILE_FOLLOWING_URL), "GET");
  yield put(
    setAllUsers({
      isLoading: false,
      following: followingList.map((doc) => doc.id),
      allUsers: allUsers.filter((doc) => doc.id !== userId),
    })
  );
}

export function* followUser(action) {
  let { id, displayName } = action.payload;
  let followingRes = yield select(
    (state) => state.profileReducer.followingList
  );
  if (!followingRes) {
    followingRes = yield mockApi(getUrl(PROFILE_FOLLOWING_URL), "GET");
  }
  const res = yield mockApi(getUrl(PROFILE_FOLLOWING_URL), "PUT", {
    success: true,
    data: [...followingRes, { id: id, displayName: displayName }],
  });

  console.log(res);

  yield put(setSagaAllUsers());
}

export function* unfollowUser(action) {
  let { id } = action.payload;
  let followingRes = yield select(
    (state) => state.profileReducer.followingList
  );
  if (!followingRes) {
    followingRes = yield mockApi(getUrl(PROFILE_FOLLOWING_URL), "GET");
  }
  const res = yield mockApi(getUrl(PROFILE_FOLLOWING_URL), "PUT", {
    success: true,
    data: followingRes.filter((doc) => doc.id !== id),
  });

  console.log(res);

  yield put(setSagaAllUsers());
}

export function* toggleLike(action) {
  const userId = yield select((state) => state.userReducer.userId);
  const feeds = yield select((state) => state.feedsReducer.feeds);
  const { postId, ownerId, likes, likeStatus } = action.payload;
  let body;
  if (likeStatus) {
    body = feeds.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          likes: [...post.likes, userId],
        };
      }
      return post;
    });
  } else {
    body = feeds.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.likes.filter((doc) => doc !== userId),
        };
      }
      return post;
    });
  }

  console.log("body", body);

  const res = yield mockApi(getUrl(FEEDS_URL), "PUT", {
    success: true,
    data: body,
  });

  console.log("res", res);

  yield put(sagaGetFeeds());
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
