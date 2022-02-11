/*
 *
 * OpenJob reducer
 *
 */
import produce from 'immer';
import { 
  ASSIGN_RECRUITER,
  ASSIGN_RECRUITER_SUCCESS,
  ASSIGN_RECRUITER_ERROR,
} from './constants';

export const initialState = {
  assignRecruiterLoading: false,
  assignRecruiterError: null,
  assignRecruiterResponse: null,
};

/* eslint-disable default-case, no-param-reassign */
const openJobReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case ASSIGN_RECRUITER:
        draft.assignRecruiterLoading = true;
        draft.assignRecruiterError = null;
        draft.assignRecruiterResponse = null;
        break;
      case ASSIGN_RECRUITER_SUCCESS:
        draft.assignRecruiterError = null;
        draft.assignRecruiterLoading = false;
        draft.assignRecruiterResponse = action.response;
        break;
      case ASSIGN_RECRUITER_ERROR:
        draft.assignRecruiterError = action.error;
        draft.assignRecruiterLoading = false;
        draft.assignRecruiterResponse = null;
        break;
      default:
        break;
    }
  });

export default openJobReducer;
