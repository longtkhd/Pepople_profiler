/*
 *
 * GET JOBS reducer
 *
 */
import produce from 'immer';
import {
  FETCH_OPEN_JOB,
  GET_OPEN_JOB_SUCCESS,
  GET_OPEN_JOB_FAIL,
  CLEAN_OPEN_JOB,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  jobList: null,
};

/* eslint-disable default-case, no-param-reassign */
const createJobStateReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case FETCH_OPEN_JOB:
        draft.loading = true;
        break;
      case GET_OPEN_JOB_SUCCESS:
        draft.loading = false;
        draft.jobList = action.payload;
        break;
      case GET_OPEN_JOB_FAIL:
        draft.loading = false;
        draft.jobList = action.payload;
        break;
      case CLEAN_OPEN_JOB:
        draft.loading = false;
        draft.error = null;
        draft.jobList = null;
        break;
    }
  });

export default createJobStateReducer;
