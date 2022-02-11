/*
 *
 * CreateProjectAssessment reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  CREATE_PROJECT_ASSESSMENT,
  CREATE_PROJECT_ASSESSMENT_SUCCESS,
  CREATE_PROJECT_ASSESSMENT_FAILED,
  RESET_STATE

} from './constants';

export const initialState = {
  loading: false,
  error: null,
  response: null
};

/* eslint-disable default-case, no-param-reassign */
const createProjectAssessmentReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CREATE_PROJECT_ASSESSMENT:
        draft.loading = true;
        draft.error = null;
        draft.response = null;
        break;
      case CREATE_PROJECT_ASSESSMENT_SUCCESS:
        draft.error = null;
        draft.loading = null;
        draft.response = action.payload.success;
        break;
      case CREATE_PROJECT_ASSESSMENT_FAILED:
        draft.error = action.error;
        draft.loading = null;
        draft.response = null;
        break;
      case RESET_STATE:
        draft.error = null;
        draft.loading = null;
        draft.response = null;
        break;
      case DEFAULT_ACTION:
        break;
    }
  });

export default createProjectAssessmentReducer;
