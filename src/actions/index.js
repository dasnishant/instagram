export const userSignUp = (payload) => {
  return { type: "USER_SIGN_UP", payload };
};

export const sagaUserSignUp = (payload) => {
  return { type: "SAGA_USER_SIGN_UP", payload };
};

export const userLogIn = (payload) => {
  return { type: "USER_LOG_IN", payload };
};

export const sagaUserLogIn = (payload) => {
  return { type: "SAGA_USER_LOG_IN", payload };
};

export const userLogOut = () => {
  return { type: "USER_LOG_OUT" };
};

export const sagaGetFeeds = (payload) => {
  return { type: "SAGA_GET_FEEDS", payload };
};

export const setFeeds = (payload) => {
  return { type: "SET_FEEDS", payload };
};

export const resetFeeds = () => {
  return { type: "RESET_FEEDS" };
};

export const sagaSetProfile = (payload) => {
  return { type: "SAGA_GET_PROFILE", payload };
};

export const setProfile = (payload) => {
  return { type: "SET_PROFILE", payload };
};

export const setSagaFollowers = (payload) => {
  return { type: "SET_SAGA_FOLLOWERS", payload };
};

export const setFollowers = (payload) => {
  return { type: "SET_FOLLOWERS", payload };
};

export const setSagaFollowing = (payload) => {
  return { type: "SET_SAGA_FOLLOWING", payload };
};

export const setFollowing = (payload) => {
  return { type: "SET_FOLLOWING", payload };
};

export const setSagaAllUsers = (payload) => {
  return { type: "SET_SAGA_ALL_USERS", payload };
};

export const setAllUsers = (payload) => {
  return { type: "SET_ALL_USERS", payload };
};

export const sagaFollow = (payload) => {
  return { type: "SAGA_FOLLOW", payload };
};

export const sagaUnfollow = (payload) => {
  return { type: "SAGA_UNFOLLOW", payload };
};

export const sagaLike = (payload) => {
  return { type: "SAGA_LIKE", payload };
};

export const sagaRemoveLike = (payload) => {
  return { type: "SAGA_REMOVE_LIKE", payload };
};

export const setError = (payload) => {
  return { type: "SET_ERROR", payload };
};
