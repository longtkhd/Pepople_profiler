/*
 *
 * GetAssessmentType reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  GET_ASSESSMENT_TYPE,
  GET_ASSESSMENT_TYPE_SUCCESS,
  GET_ASSESSMENT_TYPE_ERROR,
  GET_ASSESSMENT_TYPE_BY_ID,
  GET_ASSESSMENT_TYPE_SUCCESS_BY_ID,
  GET_ASSESSMENT_TYPE_ERROR_BY_ID
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  assessmentType: null,
  assessmentTypeInfo: null
};

/* eslint-disable default-case, no-param-reassign */
const getAssessmentTypeReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_ASSESSMENT_TYPE:
        console.log('get')
        draft.error = null;
        draft.loading = true;
        draft.assessmentType = null;
        break;
      case GET_ASSESSMENT_TYPE_SUCCESS:
        draft.error = null;
        draft.loading = null;
        draft.assessmentType = action.payload;
        console.log(action)

        break;
      case GET_ASSESSMENT_TYPE_ERROR:
        draft.error = action.error;
        draft.loading = null;
        draft.assessmentType = null;
        break;
      case GET_ASSESSMENT_TYPE:
        draft.loading = true;
        draft.error = null;
        draft.assessmentTypeInfo = null;
        break;
      case GET_ASSESSMENT_TYPE_SUCCESS_BY_ID:
        draft.loading = null;
        draft.error = null;
        draft.assessmentTypeInfo = action.payload.data;
        break;
      case GET_ASSESSMENT_TYPE_ERROR_BY_ID:
        draft.loading = null;
        draft.error = action.error;
        draft.assessmentTypeInfo = null;
        break;
      case DEFAULT_ACTION:
        break;
    }
  });

export default getAssessmentTypeReducer;
