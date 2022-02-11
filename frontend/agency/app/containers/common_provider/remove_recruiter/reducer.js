/*
 *
 * RecruiterListPage reducer
 *
 */
import produce from 'immer';
import { 
  DELETE_RECRUITER,
  DELETE_RECRUITER_SUCCESS,
  DELETE_RECRUITER_ERROR,
} from './constants';
import { LOCATION_CHANGE } from 'connected-react-router';

export const initialState = {
  loading: false,
  error: null,
  deleteRecruiterResponse: null,
};

/* eslint-disable default-case, no-param-reassign */
const removeRecruiterReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DELETE_RECRUITER:
        draft.error = null;
        draft.loading = true;
        break;
      case DELETE_RECRUITER_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.deleteRecruiterResponse = action.response;
        break;
      case DELETE_RECRUITER_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
      case LOCATION_CHANGE:
        draft.error = null;
        draft.loading = false;
        draft.deleteRecruiterResponse = null;
        break;
      default:
        break;
    }
  });

export default removeRecruiterReducer;
