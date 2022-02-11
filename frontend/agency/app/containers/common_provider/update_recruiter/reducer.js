/*
 *
 * Update agency reducer
 *
 */
import produce from 'immer';
import { 
  UPDATE_RECRUITER,
  UPDATE_RECRUITER_SUCCESS,
  UPDATE_RECRUITER_ERROR,
  CLEAR_DATA,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  response: null,
};

/* eslint-disable default-case, no-param-reassign */
const updateRecruiterReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CLEAR_DATA:
        draft.error = null;
        draft.loading = false;
        draft.response = null;
        break;
      case UPDATE_RECRUITER:
        draft.error = null;
        draft.loading = true;
        draft.response = null;
        break;
      case UPDATE_RECRUITER_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.response = action.payload
        break;
      case UPDATE_RECRUITER_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.response = null;
      default:
        break;
    }
  });

export default updateRecruiterReducer;
