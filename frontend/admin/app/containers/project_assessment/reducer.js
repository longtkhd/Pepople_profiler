/*
 *
 * ProjectAssessment reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  DELETE_PROJECT_ASSESSMENT,
  DELETE_PROJECT_ASSESSMENT_SUCCESS,
  DELETE_PROJECT_ASSESSMENT_ERROR,
  RESET_STATE
} from './constants';

export const initialState = {
  loading: null,
  error: null,
  success: null

};

/* eslint-disable default-case, no-param-reassign */
const projectAssessmentReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DELETE_PROJECT_ASSESSMENT:
        draft.loading = true;
        draft.error = null;
        draft.success = null;
        break;
      case DELETE_PROJECT_ASSESSMENT_SUCCESS:
        draft.loading = null;
        draft.error = null;
        draft.success = action.payload;
        break;
      case DELETE_PROJECT_ASSESSMENT_ERROR:
        draft.loading = null;
        draft.error = action.error;
        draft.success = null;
        break;
      case RESET_STATE:
        draft.loading = null;
        draft.error = null;
        draft.success = null;
        break;


      case DEFAULT_ACTION:
        break;
    }
  });

export default projectAssessmentReducer;
