import { combineReducers } from "redux";
import userReducer from "./userReducer";
import feedsReducer from "./feedsReducer";
import errorReducer from "./errorReducer";
import profileReducer from "./profileReducer";
import allUsersReducer from "./allUsersReducer";

const rootReducer = combineReducers({
  userReducer,
  feedsReducer,
  errorReducer,
  profileReducer,
  allUsersReducer,
});

export default rootReducer;
