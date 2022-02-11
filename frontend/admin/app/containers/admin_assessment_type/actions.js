/*
 *
 * AdminAssessmentType actions
 *
 */

import {
  DEFAULT_ACTION,
  DELETE_ASSESSMENT_TYPE,
  DELETE_ASSESSMENT_TYPE_SUCCESS,
  DELETE_ASSESSMENT_TYPE_ERROR

} from './constants';

import { deleteAssessmentType } from 'services/api/adminService'


export default typeId => {
  return async dispatch => {
    try {
      dispatch(deleteAssessmentTypeAction());
      const res = await deleteAssessmentType(typeId);
      dispatch(deleteAssessmentTypeSuccess(res.data)).then(() => {
        dispatch(resetState())
      })

    } catch (e) {
      dispatch(deleteAssessmentTypeError(e?.response?.data))

    }
  }
}
export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}



function deleteAssessmentTypeAction(payload) {
  return {
    type: DELETE_ASSESSMENT_TYPE,
    payload
  }
}

function deleteAssessmentTypeSuccess(payload) {
  return {
    type: DELETE_ASSESSMENT_TYPE_SUCCESS,
    payload
  }
}

function deleteAssessmentTypeError(error) {
  return {
    type: DELETE_ASSESSMENT_TYPE_ERROR,
    error
  }
}

function resetState() {
  return {
    type: RESET_STATE,

  }
}
