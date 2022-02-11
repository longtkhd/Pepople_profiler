/*
 *
 * EditAssessmentType actions
 *
 */

import {
  DEFAULT_ACTION,
  EDIT_ASSESSMENT_TYPE,
  EDIT_ASSESSMENT_TYPE_SUCCESS,
  EDIT_ASSESSMENT_TYPE_ERROR,
  RESET_STATE
} from './constants';

import { editAssessmentType } from 'services/api/adminService'

export default (TypeId, data) => {
  return async dispatch => {
    try {
      dispatch(editAssessmentTypeAction());
      const res = await editAssessmentType(TypeId, data)
      dispatch(editAssessmentTypeSuccess(res.data))
      dispatch(resetState())
    } catch (err) {
      dispatch(editAssessmentTypeError(err.response?.data))
    }
  }
}


export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function editAssessmentTypeAction() {
  return {
    type: EDIT_ASSESSMENT_TYPE,

  }
}

export function editAssessmentTypeSuccess(payload) {
  return {
    type: EDIT_ASSESSMENT_TYPE_SUCCESS,
    payload
  }
}

export function editAssessmentTypeError(payload) {
  return {
    type: EDIT_ASSESSMENT_TYPE_ERROR,
    payload
  }
}


export function resetState(payload) {
  return {
    type: RESET_STATE,
    payload
  }
}




