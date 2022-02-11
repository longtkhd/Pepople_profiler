/*
 *
 * ProjectAssessment reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  GET_PROJECT_ASSESSMENT,
  GET_PROJECT_ASSESSMENT_SUCCESS,
  GET_PROJECT_ASSESSMENT_ERROR,
  GET_PROJECT_ASSESSMENT_BY_ID,
  GET_PROJECT_ASSESSMENT_BY_ID_SUCCESS,
  GET_PROJECT_ASSESSMENT_BY_ID_ERROR
} from './constants';

export const initialState = {
  loading: null,
  error: null,
  projectAssessment: null,
  projectAssessmentInfo: null
};

/* eslint-disable default-case, no-param-reassign */
const projectAssessmentReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_PROJECT_ASSESSMENT:
        draft.loading = true;
        draft.error = null;
        draft.projectAssessment = null;
        break;
      case GET_PROJECT_ASSESSMENT_SUCCESS:
        draft.loading = null;
        draft.error = null;
        draft.projectAssessment = action.payload.data;
        break;
      case GET_PROJECT_ASSESSMENT_ERROR:
        draft.loading = null;
        draft.error = action.error;
        draft.projectAssessment = null;
        break;
      case GET_PROJECT_ASSESSMENT_BY_ID:
        draft.error = null;
        draft.loading = true;
        draft.projectAssessmentInfo = null;
        break;
      case GET_PROJECT_ASSESSMENT_BY_ID_SUCCESS:
        draft.error = null;
        draft.loading = null;
        draft.projectAssessmentInfo = action.payload;
        console.log(action.payload.data)
        break;
      case GET_PROJECT_ASSESSMENT_BY_ID_ERROR:
        draft.error = action.error;
        draft.loading = null;
        draft.projectAssessmentInfo = null;
        break;



      case DEFAULT_ACTION:
        break;
    }
  });

export default projectAssessmentReducer;
