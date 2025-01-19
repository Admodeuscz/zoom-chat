import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { APIClient } from "../../helpers/apiClient";
import {
  apiError,
  loginUserSuccess,
  logoutUserSuccess,
  profileSuccess,
} from "./actions";
import { LOGIN_USER, LOGOUT_USER, PROFILE } from "./constants";

/**
 * Sets the session
 * @param {*} user
 */

const create = new APIClient().create;
const get = new APIClient().get;

function* login({ payload: { op_id, pwd, history } }) {
  try {
    const response = yield call(create, "/login", { op_id, pwd });

    if (response.access_token) {
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginUserSuccess(response.user));
      history("/");
    } else {
      yield put(apiError(response));
    }
  } catch (error) {
    yield put(apiError(error));
  }
}

/**
 * Logout the user
 * @param {*} param0
 */
function* logout({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");
    yield put(logoutUserSuccess(true));
    history("/login");
  } catch (error) {}
}

function* profile() {
  try {
    const response = yield call(get, "/me");
    yield put(profileSuccess(response.user));
  } catch (error) {
    yield put(apiError(error));
  }
}

export function* watchLoginUser() {
  yield takeEvery(LOGIN_USER, login);
}

export function* watchLogoutUser() {
  yield takeEvery(LOGOUT_USER, logout);
}

export function* watchProfile() {
  yield takeEvery(PROFILE, profile);
}

function* authSaga() {
  yield all([fork(watchLoginUser), fork(watchLogoutUser), fork(watchProfile)]);
}
export default authSaga;
