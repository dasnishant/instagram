const initialAllUsersState = {
  showUsers: false,
  isLoading: true,
  allUsers: [],
  following: [],
};

const allUsersReducer = (state = initialAllUsersState, action) => {
  switch (action.type) {
    case "SET_ALL_USERS":
      return { ...action.payload };
    case "FOLLOW":
      return { ...state, ...action.payload };
    case "UNFOLLOW":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default allUsersReducer;
