import { combineReducers } from "redux";
import userReducer from "./userReducer";
import feedsReducer from "./feedsReducer";
import profileReducer from "./profileReducer";
import allUsersReducer from "./allUsersReducer";

const rootReducer = combineReducers({
  userReducer,
  feedsReducer,
  profileReducer,
  allUsersReducer,
});

export default rootReducer;
