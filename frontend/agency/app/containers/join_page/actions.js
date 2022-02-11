/*
 *
 * JoinPage actions
 *
 */

import {
  INIT_STEP,
  NEXT_STEP,
  INIT_JOIN_PAGE,
  RECEIVE_RECRUITER_INFO,
  RECEIVE_RECRUITER_INFO_FAIL,
  CREATE_PASS_SUCCESS,
  CREATE_PASS_FAIL,
  CREATE_PASS_LOADING,
  INIT_EDIT_PERSONAL_DETAIL,
  EIDT_PERSONAL_DETAIL_SUCCESS,
  EIDT_PERSONAL_DETAIL_FAIL,
  CLEAN_UP_EDIT_PERSONAL,
  CLEAN_UP_PASSWORD,
} from './constants';
import * as authService from 'services/api/authService';
import * as userService from 'services/api/userService';
// updateRecruiter

export const initJoinPagge = token => async dispatch => {
  try {
    dispatch({ type: INIT_JOIN_PAGE });
    const res = await authService.checkToken(token);
    dispatch(recruiterInfo(res.data));
  } catch (error) {
    dispatch({ type: RECEIVE_RECRUITER_INFO_FAIL, payload: error });
  }
};

export const editPersonalDetail = (payload,params) => async dispatch => {
  try {
    dispatch(initEditPersonal());
    const res = await userService.updateProfile(payload,params);
    dispatch(editPersonalSuccess(res.data));
  } catch (error) {
    dispatch(editPersonalFail(error));
  };
}

export const createNewPassword = (accessToken,payload) => async dispatch => {
  try {
    dispatch({ type: CREATE_PASS_LOADING });
    const res = await authService.createNewPass(accessToken,payload);
    dispatch({ type: CREATE_PASS_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: CREATE_PASS_FAIL, payload: res.data.error });
  };
}

export function initStep() {
  return {
    type: INIT_STEP,
  };
};

export const nextStepForm = (step) => ({
  type: NEXT_STEP,
  payload: step + 1
});

export const recruiterInfo = payload => ({
  type: RECEIVE_RECRUITER_INFO,
  payload
});

export const initEditPersonal = () => ({
  type: INIT_EDIT_PERSONAL_DETAIL,
})

export const editPersonalSuccess = payload => ({
  type: EIDT_PERSONAL_DETAIL_SUCCESS,
  payload,
});

export const editPersonalFail = payload => ({
  type: EIDT_PERSONAL_DETAIL_FAIL,
  payload,
});

export const cleanUpPassword = () => ({
  type: CLEAN_UP_PASSWORD,
});

export const cleanUpEditPersonal = () => ({
  type: CLEAN_UP_EDIT_PERSONAL,
});
