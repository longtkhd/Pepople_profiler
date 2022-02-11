/*
 *
 * CHANGE STATUS JOB reducer
 *
 */
import produce from 'immer';
import {
  CHANGE_STATUS_JOB_INIT,
  CHANGE_STATUS_JOB_SUCCESS,
  CHANGE_STATUS_JOB_FAIL,
  CLEAN_CHANGE_STATUS_JOB,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
};

/* eslint-disable default-case, no-param-reassign */
const changeStatusJob = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CHANGE_STATUS_JOB_INIT:
        draft.loading = true;
        break;
      case CHANGE_STATUS_JOB_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case CHANGE_STATUS_JOB_FAIL:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case CLEAN_CHANGE_STATUS_JOB:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        break;
    }
  });

export default changeStatusJob;
