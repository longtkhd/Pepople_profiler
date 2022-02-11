/*
 *
 * RecruiterJob reducer
 *
 */
import produce from 'immer';
import { 
  LOAD_OPEN_JOBS,
  LOAD_OPEN_JOBS_SUCCESS,
  LOAD_OPEN_JOBS_ERROR,
  LOAD_CLOSED_JOBS,
  LOAD_CLOSED_JOBS_SUCCESS,
  LOAD_CLOSED_JOBS_ERROR,
} from './constants';

export const initialState = {
  openJobLoading: false,
  closedJobLoading: false,
  error: null,
  openJobResponse: null,
  closedJobResponse: null,
};

/* eslint-disable default-case, no-param-reassign */
const recruiterJobReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_OPEN_JOBS:
        draft.error = null;
        draft.openJobLoading = true;
        draft.openJobResponse = null;
        break;
      case LOAD_OPEN_JOBS_SUCCESS:
        draft.error = null;
        draft.openJobLoading = false;
        draft.openJobResponse = action.response;
        break;
      case LOAD_OPEN_JOBS_ERROR:
        draft.error = action.error;
        draft.openJobLoading = false;
        draft.openJobResponse = null;
        break;
      case LOAD_CLOSED_JOBS:
        draft.error = null;
        draft.closedJobLoading = true;
        draft.closedJobResponse = null;
        break;
      case LOAD_CLOSED_JOBS_SUCCESS:
        draft.error = null;
        draft.closedJobLoading = false;
        draft.closedJobResponse = action.response;
        break;
      case LOAD_CLOSED_JOBS_ERROR:
        draft.error = action.error;
        draft.closedJobLoading = false;
        draft.closedJobResponse = null;
        break;
      default:
        break;
    }
  });

export default recruiterJobReducer;
