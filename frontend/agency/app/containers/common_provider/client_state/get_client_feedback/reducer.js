import produce from 'immer';
import {
  GET_CLIENT_FEEDBACK,
  GET_CLIENT_FEEDBACK_SUCCESS,
  GET_CLIENT_FEEDBACK_ERROR,
  CLEAR_CLIENT_FEEDBACK 
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  feedback: null,
};

/* eslint-disable default-case, no-param-reassign */
const getClientFeedbackReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_CLIENT_FEEDBACK:
        draft.loading = true;
        draft.error = null;
        draft.feedback = null;
        break;
      case GET_CLIENT_FEEDBACK_SUCCESS:
        draft.loading = false;
        draft.feedback = action.payload.data;
        draft.error = null;
        
        break;
      case GET_CLIENT_FEEDBACK_ERROR:
        draft.loading = false;
        draft.feedback = null;
        draft.error = action.error;
        break;
      case CLEAR_CLIENT_FEEDBACK:
        draft.loading = false;
        draft.feedback = null;
        draft.error = null;
        break;
      default:
        break;
    }
  });

export default getClientFeedbackReducer;
