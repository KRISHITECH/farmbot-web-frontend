import thunk from "redux-thunk";
import { applyMiddleware, compose, Middleware } from "redux";
import { EnvName } from "./interfaces";

const USELESS_ACTION = " is unused or needs to be implemented. " +
  "consider deleting it or writing a handler.";
const NO_TYPE = "an action with no `type` property";

interface MiddlewareConfig {
  fn: Middleware;
  env: EnvName;
};

let last = "!";

/** To make it easier to manage all things watching the state tree,
 * we keep subscriber functions in this array. */
export let mwConfig: MiddlewareConfig[] = [
  {
    env: "*",
    fn: thunk
  }
  , {
    env: "development",
    fn: require("redux-immutable-state-invariant")()
  }
];

export function getMiddleware(env: EnvName) {
  let middlewareFns = mwConfig
    .filter(function (mwc) { return (mwc.env === env) || (mwc.env === "*"); })
    .map((mwc) => mwc.fn);
  let dtCompose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  const composeEnhancers = dtCompose || compose;
  let middlewares = applyMiddleware(...middlewareFns);

  return composeEnhancers(middlewares);
};
