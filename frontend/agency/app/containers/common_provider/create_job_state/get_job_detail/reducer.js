/*
 *
 * GET JOBS reducer
 *
 */
import produce from 'immer';
import {
  GET_JOB_DETAIL_INIT,
  GET_JOB_DETAIL_SUCCESS,
  GET_JOB_DETAIL_FAIL,
  CLEAN_UP,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  jobDetail: null,
};

/* eslint-disable default-case, no-param-reassign */
const createJobStateReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_JOB_DETAIL_INIT:
        draft.loading = true;
        break;
      case GET_JOB_DETAIL_SUCCESS:
        draft.loading = false;
        draft.jobDetail = action.payload;
        break;
      case GET_JOB_DETAIL_FAIL:
        draft.loading = false;
        draft.jobDetail = action.payload;
        break;
      case CLEAN_UP:
        draft.loading = false;
        draft.error = null;
        draft.jobDetail = null;
        break;
    }
  });

export default createJobStateReducer;
