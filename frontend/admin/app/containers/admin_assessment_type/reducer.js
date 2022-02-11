/*
 *
 * AdminAssessmentType reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  DELETE_ASSESSMENT_TYPE,
  DELETE_ASSESSMENT_TYPE_SUCCESS,
  DELETE_ASSESSMENT_TYPE_ERROR,
  RESET_STATE
} from './constants';

export const initialState = {
  loading: null,
  error: null,
  success: null
};

/* eslint-disable default-case, no-param-reassign */
const adminAssessmentTypeReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DELETE_ASSESSMENT_TYPE:
        draft.loading = true;
        draft.error = null;
        draft.success = null;
        break;
      case DELETE_ASSESSMENT_TYPE_SUCCESS:
        draft.loading = null;
        draft.error = null;
        draft.success = action.payload;
        break;
      case DELETE_ASSESSMENT_TYPE_ERROR:
        draft.error = action.error;
        draft.success = null;
        draft.loading = null;
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

export default adminAssessmentTypeReducer;
