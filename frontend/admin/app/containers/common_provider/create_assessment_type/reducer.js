/*
 *
 * CreateAssessmentIndustry reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  CREATE_ASSESSMENT_TYPE,
  CREATE_ASSESSMENT_TYPE_SUCCESSED,
  CREATE_ASSESSMENT_TYPE_ERROR,
  RESET_STATE
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  success: null
};

/* eslint-disable default-case, no-param-reassign */
const createAssessmentTypeReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CREATE_ASSESSMENT_TYPE:
        draft.loading = true;
        draft.error = null;
        draft.success = null;
        break;
      case CREATE_ASSESSMENT_TYPE_SUCCESSED:
        draft.error = null;
        draft.loading = null;
        draft.success = action.payload.success;
        break;
      case CREATE_ASSESSMENT_TYPE_ERROR:
        draft.error = action.error;
        draft.loading = null;
        draft.success = null;
        break;
      case RESET_STATE:
        draft.error = null;
        draft.loading = null;
        draft.success = null;
        break;
      case DEFAULT_ACTION:
        break;
    }
  });

export default createAssessmentTypeReducer;
