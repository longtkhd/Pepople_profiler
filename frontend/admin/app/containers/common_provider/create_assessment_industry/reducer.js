/*
 *
 * CreateAssessmentIndustry reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  CREATE_ASSESSMENT_INDUSTRY,
  CREATE_ASSESSMENT_INDUSTRY_SUCCESS,
  CREATE_ASSESSMENT_INDUSTRY_ERROR,
  RESET_STATE
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  response: null
};

/* eslint-disable default-case, no-param-reassign */
const createAssessmentIndustryReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CREATE_ASSESSMENT_INDUSTRY:
        draft.loading = true;
        draft.error = null;
        draft.response = null;
        break;
      case CREATE_ASSESSMENT_INDUSTRY_SUCCESS:
        draft.error = null;
        draft.loading = null;
        draft.response = action.payload.success;
        console.log('vao day')
        // console.log('actiopn', action.payload)
        break;
      case CREATE_ASSESSMENT_INDUSTRY_ERROR:
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

export default createAssessmentIndustryReducer;
