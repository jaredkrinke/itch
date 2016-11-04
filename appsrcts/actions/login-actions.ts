
import {createAction} from "redux-actions";

import {
  LOGIN_START_PICKING,
  LOGIN_STOP_PICKING,

  ATTEMPT_LOGIN, IAttemptLoginPayload,
  LOGIN_WITH_PASSWORD, ILoginWithPasswordPayload,
  LOGIN_WITH_TOKEN, ILoginWithTokenPayload,
  LOGIN_FAILED, ILoginFailedPayload,
  LOGIN_SUCCEEDED, ILoginSucceededPayload,

  CHANGE_USER, IChangeUserPayload,
  LOGOUT, ILogoutPayload,
} from "../constants/action-types";

export const loginStartPicking = createAction(LOGIN_START_PICKING);
export const loginStopPicking = createAction(LOGIN_STOP_PICKING);

export const attemptLogin = createAction<IAttemptLoginPayload>(ATTEMPT_LOGIN);
export const loginWithPassword = createAction<ILoginWithPasswordPayload>(LOGIN_WITH_PASSWORD);
export const loginWithToken = createAction<ILoginWithTokenPayload>(LOGIN_WITH_TOKEN);
export const loginFailed = createAction<ILoginFailedPayload>(LOGIN_FAILED);
export const loginSucceeded = createAction<ILoginSucceededPayload>(LOGIN_SUCCEEDED);

export const changeUser = createAction<IChangeUserPayload>(CHANGE_USER);
export const logout = createAction<ILogoutPayload>(LOGOUT);
