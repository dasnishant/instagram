const userInitialState = {
  userId: null,
  displayName: null,
  error: null,
};

const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case "USER_SIGN_UP":
      return {
        ...state,
        userId: action.payload.userId,
        displayName: action.payload.displayName,
        error: null,
      };
    case "USER_LOG_IN":
      return {
        ...state,
        userId: action.payload.userId,
        displayName: action.payload.displayName,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default userReducer;
