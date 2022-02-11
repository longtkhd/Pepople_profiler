/*
 *
 * JoinPage reducer
 *
 */
import produce from 'immer';
import {
  CREATE_PASS_SUCCESS,
  CREATE_PASS_FAIL,
  CREATE_PASS_LOADING,
  NEXT_STEP,
  INIT_JOIN_PAGE,
  RECEIVE_RECRUITER_INFO,
  RECEIVE_RECRUITER_INFO_FAIL,
  INIT_EDIT_PERSONAL_DETAIL,
  EIDT_PERSONAL_DETAIL_SUCCESS,
  EIDT_PERSONAL_DETAIL_FAIL,
  CLEAN_UP_EDIT_PERSONAL,
  CLEAN_UP_PASSWORD,
 } from './constants';

export const initialState = {
  step: 1,
  recruiterInfo: null,
  loadingPage: false,
  error: null,
  createPassLoading: false,
  createPassError: null,
  createPassResponse: null,
  editPersonal: null,
  editPersonalLoad: false,
  editPersonalError: null,
};

/* eslint-disable default-case, no-param-reassign */
const joinPageReducer = (state = initialState, action) =>
  produce( state,( draft ) => {
    switch (action.type) {
      case NEXT_STEP:
        draft.step = action.payload > 3 ? 1 : action.payload;
        break;
      case INIT_JOIN_PAGE:
        draft.loadingPage = true;
        break;
      case RECEIVE_RECRUITER_INFO:
        draft.loadingPage = false;
        draft.recruiterInfo = action.payload;
        break;
      case RECEIVE_RECRUITER_INFO_FAIL:
        draft.loadingPage = false;
        draft.error = action.payload;
      case CREATE_PASS_LOADING:
        draft.createPassLoading = true;
        draft.createPassError = null;
        draft.createPassResponse = null;
        break;
      case CREATE_PASS_FAIL:
        draft.createPassLoading = false;
        draft.createPassError = action.error;
        draft.createPassResponse = null;
        break;
      case CREATE_PASS_SUCCESS:
        draft.createPassLoading = false;
        draft.createPassError = null;
        draft.createPassResponse = action.response;
        draft.step = 3;
        break;
      case INIT_EDIT_PERSONAL_DETAIL:
        draft.editPersonalLoad = true;
        break;
      case EIDT_PERSONAL_DETAIL_SUCCESS:
        draft.editPersonalLoad = false;
        draft.editPersonal = action.payload;
      case EIDT_PERSONAL_DETAIL_FAIL:
        draft.editPersonalLoad = false;
        draft.editPersonalError = action.payload;
        break;
      case CLEAN_UP_EDIT_PERSONAL:
        draft.editPersonalLoad = false;
        draft.editPersonalError = null;
        draft.editPersonal = null;
        break;
      case CLEAN_UP_PASSWORD:
        draft.createPassed = null;
        draft.createPassLoad = false;
    }
  });

export default joinPageReducer;
