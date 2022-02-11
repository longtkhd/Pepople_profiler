/*
 *
 * CreateProjectAssessment actions
 *
 */

import {
  DEFAULT_ACTION,
  CREATE_PROJECT_ASSESSMENT,
  CREATE_PROJECT_ASSESSMENT_SUCCESS,
  CREATE_PROJECT_ASSESSMENT_FAILED,
  RESET_STATE
} from './constants';

import { createProjectAssessment } from 'services/api/projectassessmentService'

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

function createProjectAssessmentAction(payload) {
  return {
    type: CREATE_PROJECT_ASSESSMENT,
    payload
  }
}
function createProjectAssessmentSuccess(payload) {
  return {
    type: CREATE_PROJECT_ASSESSMENT_SUCCESS,
    payload
  }
}


function resetState(payload) {
  return {
    type: RESET_STATE,
    payload
  };
}


function createProjectAssessmentError(error) {
  return {
    type: CREATE_PROJECT_ASSESSMENT_FAILED,
    error
  }
}

export default data => {
  return async dispatch => {
    try {
      dispatch(createProjectAssessmentAction());
      const res = await createProjectAssessment(data);
      dispatch(createProjectAssessmentSuccess(res.data));
      dispatch(resetState())
    } catch (e) {
      dispatch(createProjectAssessmentError(e.response?.data))
      dispatch(resetState())
    }
  }
}




