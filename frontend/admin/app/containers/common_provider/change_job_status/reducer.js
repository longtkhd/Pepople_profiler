/*
 *
 * RecruiterJob reducer
 *
 */
import produce from 'immer';
import {
  CHANGE_JOB_STATUS,
  CHANGE_JOB_STATUS_SUCCESS,
  CHANGE_JOB_STATUS_ERROR,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  response: null,
};

/* eslint-disable default-case, no-param-reassign */
const changeJobStatus = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CHANGE_JOB_STATUS:
        draft.error = null;
        draft.loading = true;
        draft.response = null;
        break;
      case CHANGE_JOB_STATUS_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.response = action.response;
        break;
      case CHANGE_JOB_STATUS_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.response = null;
        break;
      default:
        break;
    }
  });

export default changeJobStatus;
