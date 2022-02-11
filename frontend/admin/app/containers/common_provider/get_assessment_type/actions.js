/*
 *
 * GetAssessmentType actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ASSESSMENT_TYPE,
  GET_ASSESSMENT_TYPE_SUCCESS,
  GET_ASSESSMENT_TYPE_ERROR,
  GET_ASSESSMENT_TYPE_BY_ID,
  GET_ASSESSMENT_TYPE_SUCCESS_BY_ID,
  GET_ASSESSMENT_TYPE_ERROR_BY_ID
} from './constants';
import { getAssessmentTypeInfo, getAssessmentTypeById } from 'services/api/commonService'



export default () => {

  return async dispatch => {
    try {

      dispatch(getAssessmentTypeAction())
      const res = await getAssessmentTypeInfo()
      dispatch(getAssessmentTypeSuccess(res.data))
    } catch (e) {
      dispatch(getAssessmentTypeError(e?.res?.data))
    }
  }
}

function getAssessmentTypeAction(payload) {

  return {
    type: GET_ASSESSMENT_TYPE,
    payload
  }
}

function getAssessmentTypeSuccess(payload) {

  return {
    type: GET_ASSESSMENT_TYPE_SUCCESS,
    payload
  }
}

function getAssessmentTypeError(error) {
  return {
    type: GET_ASSESSMENT_TYPE_ERROR,
    error
  }
}

function getAssessmentTypeByIdAction() {
  return {
    type: GET_ASSESSMENT_TYPE_BY_ID
  }

}

function getAssessmentTypeByIdSuccess(payload) {
  return {
    type: GET_ASSESSMENT_TYPE_SUCCESS_BY_ID,
    payload
  }
}

function getAssessnebtTypeByIdError(error) {
  return {
    type: GET_ASSESSMENT_TYPE_ERROR_BY_ID,
    error
  }
}

export const getAssessmentTypeAdminById = (TypeId) => {
  return async dispatch => {
    try {
      dispatch(getAssessmentTypeByIdAction());
      const res = await getAssessmentTypeById(TypeId);
      dispatch(getAssessmentTypeByIdSuccess(res.data))
    } catch (e) {
      dispatch(getAssessnebtTypeByIdError(e.response?.data))
    }
  }
}
