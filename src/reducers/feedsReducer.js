const feedsInitialState = {
  feeds: [],
  isLoading: true,
};

const feedsReducer = (state = feedsInitialState, action) => {
  switch (action.type) {
    case "SET_FEEDS":
      return { ...action.payload };
    default:
      return state;
  }
};

export default feedsReducer;
