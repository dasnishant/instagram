const feedsInitialState = {
  feeds: [],
  isLoading: true,
};

const feedsReducer = (state = feedsInitialState, action) => {
  switch (action.type) {
    case "SET_FEEDS":
      return { ...action.payload };
    case "RESET_FEEDS":
      return { feeds: [], isLoading: true };
    default:
      return state;
  }
};

export default feedsReducer;
