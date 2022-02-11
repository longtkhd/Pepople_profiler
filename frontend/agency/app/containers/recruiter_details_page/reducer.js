/*
 *
 * RecruiterDetailsPage reducer
 *
 */
import produce from 'immer';
import { 
  GET_RECRUITER_DETAILS,
  GET_RECRUITER_DETAILS_SUCCESS,
  GET_RECRUITER_DETAILS_ERROR,
} from './constants';

export const initialState = {
  error: null,
  loading: false,
  recruiterDetails: null,
};

/* eslint-disable default-case, no-param-reassign */
const recruiterDetailsPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_RECRUITER_DETAILS:
        draft.error = null;
        draft.loading = true;
        draft.recruiterDetails = null;
        break;
      case GET_RECRUITER_DETAILS_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.recruiterDetails = action.response.data;
        break;
      case GET_RECRUITER_DETAILS_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.recruiterDetails = null;
        break;
      default:
        break;
    }
  });

export default recruiterDetailsPageReducer;
