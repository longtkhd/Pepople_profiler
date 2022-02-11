/*
 *
 * CLIENT INVITE CONTACT JOB reducer
 *
 */
import produce from 'immer';
import {
  INIT_INVITE_CONTACT_JOB,
  INVITE_CONTACT_JOB_SUCCESS,
  INVITE_CONTACT_JOB_FAIL,
  INVITE_ALL,
  INVITE_ALL_ERROR,
  INVITE_ALL_SUCCESS,
  CLEAN_UP_INVITE_CONTACT_JOB,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
};

/* eslint-disable default-case, no-param-reassign */
const inviteContactJobReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case INIT_INVITE_CONTACT_JOB:
        draft.loading = true;
        break;
      case INVITE_CONTACT_JOB_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case INVITE_CONTACT_JOB_FAIL:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case CLEAN_UP_INVITE_CONTACT_JOB:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        break;
      case INVITE_ALL:
        draft.loading = true;
        draft.result = null;
        draft.error = null;
        break;
      case INVITE_ALL_SUCCESS:
        draft.loading = false;
        draft.result = action.payload.data;
        draft.error = null;
        break;
      case INVITE_ALL_ERROR:
        draft.loading = false;
        draft.result = null;
        draft.error = action.error;
        break;
    }
  });

export default inviteContactJobReducer;
