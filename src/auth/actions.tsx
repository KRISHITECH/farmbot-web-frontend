import {
  connectDevice,
  fetchFWUpdateInfo,
  fetchOSUpdateInfo
} from "../devices/actions";
import { DeviceAccountSettings } from "../devices/interfaces";
import { push } from "../history";
import { error, success } from "../ui";
import { AuthState } from "./interfaces";
import { ReduxAction, Thunk } from "../redux/interfaces";
import { fetchSyncData } from "../sync/actions";
import { fetchRegimens } from "../regimens/actions";
import * as Axios from "axios";
import { t } from "i18next";
import * as _ from "lodash";
import { API } from "../api";
import { prettyPrintApiErrors } from "../util";
import { Session } from "../session";
import { UnsafeError } from "../interfaces";

export function didLogin(authState: AuthState, dispatch: Function) {
  API.setBaseUrl(authState.token.unencoded.iss);
  dispatch(fetchOSUpdateInfo(authState.token.unencoded.os_update_server));
  dispatch(fetchFWUpdateInfo(authState.token.unencoded.fw_update_server));
  dispatch(loginOk(authState));
  dispatch(fetchSyncData());
  // TODO: Make regimens work with sync object
  dispatch(fetchRegimens());
  dispatch(connectDevice(authState.token.encoded));
};

export function downloadDeviceData(): Thunk {
  return function (dispatch, getState) {
    Axios
      .get<DeviceAccountSettings>(API.current.devicePath)
      .then(res => dispatch({
        type: "REPLACE_DEVICE_ACCOUNT_INFO",
        payload: res.data
      }))
      .catch(payload => dispatch({
        type: "DEVICE_ACCOUNT_ERR",
        payload
      }));
  };
};

// We need to handle OK logins for numerous use cases (Ex: login & registration)
export function onLogin(dispatch: Function) {
  return (response: Axios.AxiosXHR<AuthState>) => {
    let { data } = response;
    Session.put(data);
    didLogin(data, dispatch);
    push("/app/controls");
  };
};

export function login(username: string,
  password: string,
  url: string): Thunk {
  return dispatch => {
    return requestToken(username, password, url).then(
      onLogin(dispatch),
      (err) => dispatch(loginErr())
    );
  };
}

function loginErr() {
  error(t("Login failed."));
  return { type: "LOGIN_ERR" };
}

/** Very important. Once called, all outbound HTTP requests will
 * have a JSON Web Token attached to their "Authorization" header,
 * thereby granting access to the API. */
export function loginOk(auth: AuthState): ReduxAction<AuthState> {
  Axios.interceptors.response.use(x => x, function (x) {
    console.log(x);
    let a = ![451, 401, 422].includes(x.response.status);
    let b = x.response.status > 399;
    if (a && b) {
      setTimeout(() => {
        // Explicitly throw error so error reporting tool will save it.
        let msg = "Bad response: " + x.response.status +
          JSON.stringify(x.response).slice(0, 80);
        throw new Error(msg);
      }, 1);
    }
    switch (x.response.status) {
      case 500:
        error(t("Unexpected error occurred, we've been notified of the problem."));
        break;
      case 451:
        // DONT REFACTOR: I want to use alert() because it's blocking.
        alert(t("The terms of service have recently changed. You must " +
          "accept the new terms of service to continue using the site."));
        window.location.href = "/tos_update.html";
        break;
    }
    return x;
  });
  Axios.interceptors.request.use(function (config) {
    let req = config.url;
    let isAPIRequest = req.includes(API.current.baseUrl);
    if (isAPIRequest) {
      config.headers = config.headers || {};
      let headers = (config.headers as
        { Authorization: string | undefined });
      headers.Authorization = auth.token.encoded || "CANT_FIND_TOKEN";
    }
    return config;
  });

  return {
    type: "LOGIN_OK",
    payload: auth
  };
}

/** Sign up for the FarmBot service over AJAX. */
export function register(name: string,
  email: string,
  password: string,
  confirmation: string,
  url: string): Thunk {
  return dispatch => {
    let p = requestRegistration(name,
      email,
      password,
      confirmation,
      url);
    return p.then(onLogin(dispatch),
      onRegistrationErr(dispatch));
  };
}

/** Handle user registration errors. */
export function onRegistrationErr(dispatch: Function) {
  return (err: UnsafeError) => {
    error(prettyPrintApiErrors(err));
    dispatch({
      type: "REGISTRATION_ERROR",
      payload: err
    });
  };
}

/** Build a JSON object in preparation for an HTTP POST
 *  to registration endpoint */
function requestRegistration(name: string,
  email: string,
  password: string,
  confirmation: string,
  url: string) {
  let form = {
    user: {
      email: email,
      password: password,
      password_confirmation: confirmation,
      name: name
    }
  };
  return Axios.post<AuthState>(API.current.usersPath, form);
}

/** Fetch API token if already registered. */
function requestToken(email: string,
  password: string,
  url: string) {
  let payload = { user: { email: email, password: password } };
  // Set the base URL once here.
  // It will get set once more when we get the "iss" claim from the JWT.
  API.setBaseUrl(url);
  return Axios.post<AuthState>(API.current.tokensPath, payload);
}

export function logout() {
  // When logging out, we pop up a toast message to confirm logout.
  // Sometimes, LOGOUT is dispatched when the user is already logged out.
  // In those cases, seeing a logout message may confuse the user.
  // To circumvent this, we must check if the user had a token.
  // If there was infact a token, we can safely show the message.
  if (Session.get()) { success("You have been logged out."); }
  Session.clear(true);
  // Technically this is unreachable code:
  return {
    type: "LOGOUT",
    payload: {}
  };
}
