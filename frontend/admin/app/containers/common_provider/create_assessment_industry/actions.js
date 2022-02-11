/*
 *
 * CreateAssessmentIndustry actions
 *
 */

import {
  DEFAULT_ACTION,
  CREATE_ASSESSMENT_INDUSTRY,
  CREATE_ASSESSMENT_INDUSTRY_SUCCESS,
  CREATE_ASSESSMENT_INDUSTRY_ERROR,
  RESET_STATE
} from './constants';

import { createAssessmentIndustry } from 'services/api/adminService';

export default data => {
  return async dispatch => {
    try {
      dispatch(createAssessmentIndustryAction());
      const respone = await createAssessmentIndustry(data);
      dispatch(assessmentIndustrySuccess(respone.data));

      dispatch(resetState())

    } catch (error) {
      dispatch(assessmentIndustryError(error?.response?.data))

    }
  }
}

function createAssessmentIndustryAction(payload) {
  return {
    type: CREATE_ASSESSMENT_INDUSTRY,
    payload
  }
}

function assessmentIndustrySuccess(payload) {
  return {
    type: CREATE_ASSESSMENT_INDUSTRY_SUCCESS,
    payload
  }
}

function assessmentIndustryError(error) {
  return {
    type: CREATE_ASSESSMENT_INDUSTRY_ERROR,
    error
  }
}


function resetState(payload) {
  return {
    type: RESET_STATE,
    payload
  };
}
