/*
 *
 * ProjectAssessment actions
 *
 */

import {
  DEFAULT_ACTION,
  DELETE_PROJECT_ASSESSMENT,
  DELETE_PROJECT_ASSESSMENT_SUCCESS,
  DELETE_PROJECT_ASSESSMENT_ERROR,
  RESET_STATE
} from './constants';

import { deleteProjectAssessment } from 'services/api/projectassessmentService'

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

function deleteProjectAssessmentAction() {
  return {
    type: DELETE_PROJECT_ASSESSMENT
  }
}

function deleteProjectAssessmentSuccess(payload) {
  return {
    type: DELETE_PROJECT_ASSESSMENT_SUCCESS,
    payload
  }
}

function deleteProjectAssessmentError(error) {
  return {
    type: DELETE_PROJECT_ASSESSMENT_ERROR,
    error
  }
}

function resetState(payload) {
  return {
    type: RESET_STATE,
    payload

  }
}


export default projectId => {
  return async dispatch => {
    try {
      dispatch(deleteProjectAssessmentAction());
      const res = await deleteProjectAssessment(projectId);
      dispatch(deleteProjectAssessmentSuccess(res.data));
      dispatch(resetState())
    } catch (e) {
      dispatch(deleteProjectAssessmentError(e.response?.data))
    }
  }
}
