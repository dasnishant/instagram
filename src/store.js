import { applyMiddleware, compose, createStore } from "redux";
import rootReducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "./sagas";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const sagaMiddleWare = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
  key: "userId",
  storage: storage,
  whitelist: ["userReducer"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(sagaMiddleWare))
);
const persistor = persistStore(store);

sagaMiddleWare.run(rootSaga);

export { persistor, store };
