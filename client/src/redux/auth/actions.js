import {
  API_FAILED,
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  PROFILE,
  PROFILE_SUCCESS,
} from "./constants";

export const loginUser = ({ op_id, pwd }, history) => ({
  type: LOGIN_USER,
  payload: { op_id, pwd, history },
});

export const loginUserSuccess = (user) => ({
  type: LOGIN_USER_SUCCESS,
  payload: user,
});

export const logoutUser = (history) => ({
  type: LOGOUT_USER,
  payload: { history },
});

export const logoutUserSuccess = () => {
  return {
    type: LOGOUT_USER_SUCCESS,
    payload: {},
  };
};

export const apiError = (error) => ({
  type: API_FAILED,
  payload: error,
});

export const profile = () => ({
  type: PROFILE,
});

export const profileSuccess = (user) => ({
  type: PROFILE_SUCCESS,
  payload: user,
});
