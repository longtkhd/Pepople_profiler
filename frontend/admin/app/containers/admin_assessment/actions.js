/*
 *
 * AdminAssessment actions
 *
 */

import {
  DEFAULT_ACTION,
  DELETE_ASSESSMENT,
  DELETE_ASSESSMENT_SUCCESS,
  DELETE_ASSESSMENT_ERROR,
  RESET_STATE
} from './constants';
import { deleteAssessmentIndustry } from 'services/api/adminService'

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export default industryId => {
  return async dispatch => {
    try {
      dispatch(deleteAssessmentIndustryAction());
      const response = await deleteAssessmentIndustry(industryId);
      dispatch(deleteAssessmentIndustrySuccess(response.data)).then(() => {
        dispatch(resetState())
      })
    } catch (error) {
      dispatch(deleteAssessmentIndustryError(error.response?.data))


    }
  }
}

function deleteAssessmentIndustryAction(payload) {
  return {
    type: DELETE_ASSESSMENT,
    payload

  }
}

function deleteAssessmentIndustrySuccess(payload) {
  return {
    type: DELETE_ASSESSMENT_SUCCESS,
    payload

  }
}

function deleteAssessmentIndustryError(payload) {
  return {
    type: DELETE_ASSESSMENT_ERROR,
    payload

  }
}

function resetState(payload) {
  return {
    type: RESET_STATE,
    payload

  }
}



