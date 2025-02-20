// LIBRARIES
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import KeplerGlReducer, { enhanceReduxMiddleware } from "@kepler.gl/reducers";

// CONFIG
import { custom_keplergl_reducers } from "@/lib/keplergl/reducers";

/*======= REDUCERS =======*/
export const keplergl_reducers = combineReducers({
  keplerGl: custom_keplergl_reducers,
});

/*======= MIDDLEWARES =======*/
const middlewares = enhanceReduxMiddleware([
  // Add other middlewares here if needed
]);

/*======= STORE =======*/
const store = createStore(
  keplergl_reducers,
  {},
  compose(applyMiddleware(...(middlewares as any)))
);

export default store;
