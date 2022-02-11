/*
 *
 * RecruiterJob reducer
 *
 */
import produce from 'immer';
import { 
  LOAD_CLOSED_JOBS,
  LOAD_CLOSED_JOBS_SUCCESS,
  LOAD_CLOSED_JOBS_ERROR,
} from './constants';

export const initialState = {
  closedJobLoading: false,
  error: null,
  closedJobResponse: null,
};

/* eslint-disable default-case, no-param-reassign */
const getCloseJobReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
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

export default getCloseJobReducer;
