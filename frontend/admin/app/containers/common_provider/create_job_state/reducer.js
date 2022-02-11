/*
 *
 * CreateJobState reducer
 *
 */
import produce from 'immer';
import {
  CREATE_NEW_JOB_INIT,
  CREATE_NEW_JOB_SUCCESS,
  CREATE_NEW_JOB_FAIL,
  GET_BUSINESS,
  CLEAN_UP,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
  contactList: null,
};

/* eslint-disable default-case, no-param-reassign */
const createJobStateReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CREATE_NEW_JOB_INIT:
        draft.loading = true;
        break;
      case CREATE_NEW_JOB_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case GET_BUSINESS:
        draft.contactList = action.payload;
        break;
      case CREATE_NEW_JOB_FAIL:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case CLEAN_UP:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        break;
    }
  });

export default createJobStateReducer;
