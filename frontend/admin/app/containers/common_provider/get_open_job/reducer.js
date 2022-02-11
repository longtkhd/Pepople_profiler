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
} from './constants';

export const initialState = {
  openJobLoading: false,
  error: null,
  openJobResponse: null,
};

/* eslint-disable default-case, no-param-reassign */
const getOpenJobReducer = (state = initialState, action) =>
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
      default:
        break;
    }
  });

export default getOpenJobReducer;
