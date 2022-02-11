/*
 *
 * GetAssessment actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ASSESSMENT_INDUSTRY,
  GET_ASSESSMENT_SUCCESS,
  GET_ASSESSMENT_ERROR,
  GET_ASSESSMENT_INDUSTRY_ID,
  GET_ASSESSMENT_ID_SUCCESS,
  GET_ASSESSMENT_ID_ERROR
} from './constants';

import { getAssessment } from 'services/api/commonService'
import { getAssessmentById } from 'services/api/commonService'

export default () => {
  return async dispatch => {
    try {
      dispatch(getAssessmentIndustryAction());
      const respone = await getAssessment();
      dispatch(getAssessmentIndustrySuccess(respone.data))


    } catch (error) {
      dispatch(getAssessmentIndustryError(error?.respone?.data))
    }
  }
}

export const getAssessmentAdminById = (assessmentId) => {
  console.log(assessmentId)

  return async dispatch => {
    try {
      dispatch(getAssessmentIndustryIdAction());
      const response = await getAssessmentById(assessmentId);
      dispatch(getAssessmentIndustryIdSuccess(response.data))

    } catch (e) {
      dispatch(getAssessmentIndustryIdError(e))

    }
  }

}

// export function getAssessmentAdminById(id) {
//   return async dispatch => {
//     try {
//       dispatch(getCompanyLogoAction());
//       const response = await getCompanyFileService(agencyId, fileId, type);
//       dispatch(getCompanyLogoSuccess(response.data));
//     } catch (error) {
//       dispatch(getCompanyLogoError(error.response?.data));
//     }
//   }
// }


function getAssessmentIndustryAction() {
  return {
    type: GET_ASSESSMENT_INDUSTRY,
  }
}

function getAssessmentIndustrySuccess(payload) {
  return {
    type: GET_ASSESSMENT_SUCCESS,
    payload
  }
}

function getAssessmentIndustryError(error) {
  return {
    type: GET_ASSESSMENT_ERROR,
    error
  }
}

function getAssessmentIndustryIdAction() {
  return {
    type: GET_ASSESSMENT_INDUSTRY_ID,
  }
}

function getAssessmentIndustryIdSuccess(payload) {
  return {
    type: GET_ASSESSMENT_ID_SUCCESS,
    payload
  }
}

function getAssessmentIndustryIdError(error) {
  return {
    type: GET_ASSESSMENT_ID_ERROR,
    error
  }
}

