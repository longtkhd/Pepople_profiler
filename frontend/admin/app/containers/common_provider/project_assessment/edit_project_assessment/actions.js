/*
 *
 * EditProjectAssessment actions
 *
 */

import {
  DEFAULT_ACTION,
  EDIT_PROJECT_ASSESSMENT,
  EDIT_PROJECT_ASSESSMENT_SUCCESS,
  EDIT_PROJECT_ASSESSMENT_ERROR,
  RESET_STATE
} from './constants';

import { editProjectAssessment } from 'services/api/projectassessmentService'

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

function editProjectAssessmentAction() {
  return {
    type: EDIT_PROJECT_ASSESSMENT
  }
}

function editProjectAssessmentSuccess(payload) {
  return {
    type: EDIT_PROJECT_ASSESSMENT_SUCCESS,
    payload
  }
}

function editProjectAssessmentError(error) {
  return {
    type: EDIT_PROJECT_ASSESSMENT_ERROR,
    error
  }
}

export function resetState(payload) {
  return {
    type: RESET_STATE,
    payload
  }
}

export default (projectId, data) => {
  return async dispatch => {
    try {
      dispatch(editProjectAssessmentAction());
      const res = await editProjectAssessment(projectId, data);
      dispatch(editProjectAssessmentSuccess(res.data));
      dispatch(resetState())
    } catch (e) {
      dispatch(editProjectAssessmentError(e.response?.data))
    }
  }
}
