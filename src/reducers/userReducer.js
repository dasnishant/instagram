const userInitialState = {
  userId: null,
  displayName: null,
};

const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case "USER_SIGN_UP":
      return {
        ...state,
        userId: action.payload.userId,
        displayName: action.payload.displayName,
      };
    case "USER_LOG_IN":
      return {
        ...state,
        userId: action.payload.userId,
        displayName: action.payload.displayName,
      };
    case "USER_LOG_OUT":
      return {};
    default:
      return state;
  }
};

export default userReducer;
