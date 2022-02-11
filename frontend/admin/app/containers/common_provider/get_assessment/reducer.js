/*
 *
 * GetAssessment reducer
 *
 */
import produce, { isDraft } from 'immer';
import {
  DEFAULT_ACTION,
  GET_ASSESSMENT_INDUSTRY,
  GET_ASSESSMENT_SUCCESS,
  GET_ASSESSMENT_ERROR,
  GET_ASSESSMENT_INDUSTRY_ID,
  GET_ASSESSMENT_ID_SUCCESS,
  GET_ASSESSMENT_ID_ERROR
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  assIndustry: null,
  assIndustryById: null
};

/* eslint-disable default-case, no-param-reassign */
const getAssessmentReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_ASSESSMENT_INDUSTRY:
        draft.error = null;
        draft.loading = true;
        draft.assIndustry = null;
        break;
      case GET_ASSESSMENT_SUCCESS:
        // console.log('here', action.payload)
        draft.error = null;
        draft.loading = false;
        draft.assIndustry = action.payload;
        break;
      case GET_ASSESSMENT_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.assIndustry = null;
        break;
      case GET_ASSESSMENT_INDUSTRY_ID:
        draft.error = null;
        draft.loading = true;
        draft.assIndustryById = null;
        break;
      case GET_ASSESSMENT_ID_SUCCESS:
        // console.log('here', action.payload)
        draft.error = null;
        draft.loading = null;
        draft.assIndustryById = action.payload;

        break;
      case GET_ASSESSMENT_ID_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.assIndustryById = null;
        break;

      case DEFAULT_ACTION:
        break;
    }
  });

export default getAssessmentReducer;
