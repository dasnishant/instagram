const errorInitialState = null;

const errorReducer = (state = errorInitialState, action) => {
  switch (action.type) {
    case "SET_ERROR":
      return action.payload;
    default:
      return state;
  }
};

export default errorReducer;
