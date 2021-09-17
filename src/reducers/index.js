import { combineReducers } from "redux";
import userReducer from "./userReducer";
import feedsReducer from "./feedsReducer";
import profileReducer from "./profileReducer";
import allUsersReducer from "./allUsersReducer";

const appReducer = combineReducers({
  userReducer,
  feedsReducer,
  profileReducer,
  allUsersReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "USER_LOG_OUT") {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
