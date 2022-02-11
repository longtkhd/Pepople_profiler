/*
 *
 * RecruiterListPage reducer
 *
 */
import produce from 'immer';
import {
  GET_JOB_LIST,
  GET_JOB_LIST_SUCCESS,
  GET_JOB_LIST_ERROR,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  job_list: null,
  
};

/* eslint-disable default-case, no-param-reassign */
const getJobListReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_JOB_LIST:
        draft.error = null;
        draft.loading = true;
        draft.job_list = null;
        break;
      case GET_JOB_LIST_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.job_list = action.response?.data;
        
        break;
      case GET_JOB_LIST_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.job_list = null;
        break;

      default:
        break;
    }
  });

export default getJobListReducer;
