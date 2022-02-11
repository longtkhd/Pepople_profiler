/*
 *
 * CreateAssessmentType actions
 *
 */

import {
  DEFAULT_ACTION,
  CREATE_ASSESSMENT_TYPE,
  CREATE_ASSESSMENT_TYPE_ERROR,
  CREATE_ASSESSMENT_TYPE_SUCCESSED,
  RESET_STATE

} from './constants';


import { addAssessmentType } from 'services/api/adminService';

export const createAssType = (data) => {
  return async dispatch => {
    try {
      dispatch(createAssessmentTypeAction());
      const res = await addAssessmentType(data);
      dispatch(assessmentSucced(res.data))
      dispatch(resetState())



    } catch (error) {
      dispatch(createAssessmentTypeError(error?.response?.data))

    }
  }
}
function createAssessmentTypeAction(payload) {
  return {
    type: CREATE_ASSESSMENT_TYPE,
    payload
  }
}

function assessmentSucced(payload) {
  return {
    type: CREATE_ASSESSMENT_TYPE_SUCCESSED,
    payload
  };
}

function createAssessmentTypeError(error) {
  return {
    type: CREATE_ASSESSMENT_TYPE_ERROR,
    error
  }
}


function resetState(payload) {
  return {
    type: RESET_STATE,
    payload
  };
}

