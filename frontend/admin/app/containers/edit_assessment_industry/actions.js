/*
 *
 * EditAssessmentIndustry actions
 *
 */

import {
  DEFAULT_ACTION,
  EDIT_ASSESSMENT,
  EDIT_ASSESSMENT_SUCCESS,
  EDIT_ASSESSMENT_ERROR,
  RESET_STATE
} from './constants';
import { editAssessmentIndustry } from 'services/api/adminService'

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export default (assesmentId, data) => {
  return async dispatch => {
    try {
      dispatch(editAssessmentIndustryAction());
      const response = await editAssessmentIndustry(assesmentId, data)
      dispatch(editAssessmentIndustrySuccess(response.data))
      dispatch(resetState())

    } catch (e) {
      dispatch(editAssessmentIndustryError(e?.response?.error))
    }
  }
}

export function editAssessmentIndustryAction() {
  return {
    type: EDIT_ASSESSMENT,

  }
}

export function editAssessmentIndustrySuccess(payload) {
  return {
    type: EDIT_ASSESSMENT_SUCCESS,
    payload
  }
}

export function editAssessmentIndustryError(payload) {
  return {
    type: EDIT_ASSESSMENT_ERROR,
    payload
  }
}


export function resetState(payload) {
  return {
    type: RESET_STATE,
    payload
  }
}

