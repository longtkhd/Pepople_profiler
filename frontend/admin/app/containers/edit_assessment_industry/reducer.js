/*
 *
 * EditAssessmentIndustry reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  EDIT_ASSESSMENT,
  EDIT_ASSESSMENT_SUCCESS,
  EDIT_ASSESSMENT_ERROR,
  RESET_STATE
} from './constants';

export const initialState = {
  loading: null,
  success: null,
  error: null,
  response: null
};

/* eslint-disable default-case, no-param-reassign */
const editAssessmentIndustryReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case EDIT_ASSESSMENT:
        draft.loading = true;
        draft.error = null;
        draft.success = null;
        break;
      case EDIT_ASSESSMENT_SUCCESS:
        draft.loading = null;
        draft.error = null;
        draft.success = action.payload;
        break;
      case EDIT_ASSESSMENT_ERROR:
        draft.loading = null;
        draft.success = null;
        draft.error = action.error;
        break;
      case RESET_STATE:
        draft.loading = null;
        draft.success = null;
        draft.errorr = null;
      case DEFAULT_ACTION:
        break;
    }
  });

export default editAssessmentIndustryReducer;
