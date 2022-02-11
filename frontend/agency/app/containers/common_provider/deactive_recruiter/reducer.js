import produce from 'immer';
import {
  DEACTIVE_RECRUITER,
  DEACTIVE_RECRUITER_SUCCESS,
  DEACTIVE_RECRUITER_FAILED,
  CLEAN_DEACTIVE_RECRUITER
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  response: null,
};

const deactiveRecruiterReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEACTIVE_RECRUITER:
        draft.error = null;
        draft.loading = true;
        draft.response = null;
        break;
      case DEACTIVE_RECRUITER_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.response = action.response;
        break;
      case DEACTIVE_RECRUITER_FAILED:
        draft.error = action.error;
        draft.loading = false;
        draft.response = null;
        break;
      case CLEAN_DEACTIVE_RECRUITER:
        draft.error = null;
        draft.loading = false;
        draft.response = null;
        break;
      default:
        break;
    }
  });

export default deactiveRecruiterReducer;
