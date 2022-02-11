/*
 *
 * RecruiterJob reducer
 *
 */
import produce from 'immer';
import { 
  LOAD_JOBS,
  LOAD_JOBS_SUCCESS,
  LOAD_JOBS_ERROR,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  response: null,
};

/* eslint-disable default-case, no-param-reassign */
const getJobReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_JOBS:
        draft.error = null;
        draft.loading = true;
        draft.response = null;
        break;
      case LOAD_JOBS_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.response = action.response;
        break;
      case LOAD_JOBS_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.response = null;
        break;
      default:
        break;
    }
  });

export default getJobReducer;
