/*
 *
 * ProjectAssessment actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_PROJECT_ASSESSMENT,
  GET_PROJECT_ASSESSMENT_SUCCESS,
  GET_PROJECT_ASSESSMENT_ERROR,
  GET_PROJECT_ASSESSMENT_BY_ID,
  GET_PROJECT_ASSESSMENT_BY_ID_SUCCESS,
  GET_PROJECT_ASSESSMENT_BY_ID_ERROR
} from './constants';

import { getProjectAssessment, getProjectAssessmentById } from 'services/api/commonService'
export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}



function getProjectAssessmentAction(payload) {
  return {
    type: GET_PROJECT_ASSESSMENT,
    payload

  }
}

function getProjectAssessmentSuccess(payload) {
  return {
    type: GET_PROJECT_ASSESSMENT_SUCCESS,
    payload
  }
}

function getProjectAssessmentError(error) {
  return {
    type: GET_PROJECT_ASSESSMENT_ERROR,
    error
  }
}

export default () => {
  return async dispatch => {
    try {
      dispatch(getProjectAssessmentAction());
      const res = await getProjectAssessment();
      dispatch(getProjectAssessmentSuccess(res.data))
    } catch (err) {
      dispatch(getProjectAssessmentError(err.response?.data))

    }
  }
}
export const getProjectAssessmentInfo = (id) => {
  return async dispatch => {
    try {
      dispatch(getProjectAssessmentByIdAction());
      const res = await getProjectAssessmentById(id);
      dispatch(getProjectAssessmentByIdSuccess(res.data))
    } catch (e) {
      dispatch(getProjectAssessmentByIdError(e.response?.data))
    }
  }
}


function getProjectAssessmentByIdAction(payload) {
  return {
    type: GET_PROJECT_ASSESSMENT_BY_ID,
    payload

  }
}

function getProjectAssessmentByIdSuccess(payload) {
  return {
    type: GET_PROJECT_ASSESSMENT_BY_ID_SUCCESS,
    payload
  }
}

function getProjectAssessmentByIdError(error) {
  return {
    type: GET_PROJECT_ASSESSMENT_BY_ID_ERROR,
    error
  }
}


