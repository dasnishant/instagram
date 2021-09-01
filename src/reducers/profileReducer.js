const profileInitialState = {
  isLoading: true,
  userId: null,
  displayName: null,
  followers: null,
  following: null,
  postsCount: null,
  posts: [],
  followersList: [],
  followingList: [],
};

const profileReducer = (state = profileInitialState, action) => {
  switch (action.type) {
    case "SET_PROFILE":
      return { ...action.payload, followersList: [], followingList: [] };
    case "SET_FOLLOWERS":
      return {
        ...state,
        followersList: action.payload.followersList,
        isLoading: action.payload.isLoading,
      };
    case "SET_FOLLOWING":
      return {
        ...state,
        followingList: action.payload.followingList,
        isLoading: action.payload.isLoading,
      };
    default:
      return state;
  }
};

export default profileReducer;
