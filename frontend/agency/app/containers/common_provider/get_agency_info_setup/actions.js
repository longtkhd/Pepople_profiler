/*
 *
 * Get user info actions
 *
 */

import { 
  GET_AGENCY_INFO,
  GET_AGENCY_INFO_SUCCESS,
  GET_AGENCY_INFO_ERROR,
  GET_COMPANY_LOGO,
  GET_COMPANY_LOGO_SUCCESS,
  GET_COMPANY_LOGO_ERROR,
  GET_COMPANY_BACKGROUND,
  GET_COMPANY_BACKGROUND_SUCCESS,
  GET_COMPANY_BACKGROUND_ERROR,
} from './constants';
import { getAgencyInfoSetup, getCompanyFileSetup } from 'services/api/agencyService';

export default (accessToken, agencyId) => {
  return async dispatch => {
    try {
      dispatch(getAgencyInfo());
      const response = await getAgencyInfoSetup(accessToken, agencyId);
      dispatch(getAgencyInfoSuccess(response.data));
    } catch (err) {
      dispatch(getAgencyInfoError(err.response?.data));
    }
  }
}

export function getCompanyLogo(accessToken, agencyId, fileId, type) {
  return async dispatch => {
    try {
      dispatch(getCompanyLogoAction());
      const response = await getCompanyFileSetup(accessToken, agencyId, fileId, type);
      dispatch(getCompanyLogoSuccess(response.data));
    } catch (error) {
      dispatch(getCompanyLogoError(error.response?.data));
    }
  }
}

export function getCompanyBackground(accessToken, agencyId, fileId, type) {
  return async dispatch => {
    try {
      dispatch(getCompanyBackgroundAction());
      const response = await getCompanyFileSetup(accessToken, agencyId, fileId, type);
      dispatch(getCompanyBackgroundSuccess(response.data));
    } catch (error) {
      dispatch(getCompanyBackgroundError(error.response?.data));
    }
  }
}

function getAgencyInfo() {
  return {
    type: GET_AGENCY_INFO,
  };
}

function getAgencyInfoSuccess(response) {
  return {
    type: GET_AGENCY_INFO_SUCCESS,
    response
  };
}

function getAgencyInfoError(error) {
  return {
    type: GET_AGENCY_INFO_ERROR,
    error
  };
}

function getCompanyLogoAction() {
  return {
    type: GET_COMPANY_LOGO,
  }
}

function getCompanyLogoSuccess(response) {
  return {
    type: GET_COMPANY_LOGO_SUCCESS,
    response
  }
}

function getCompanyLogoError(error) {
  return {
    type: GET_COMPANY_LOGO_ERROR,
    error
  }
}

function getCompanyBackgroundAction() {
  return {
    type: GET_COMPANY_BACKGROUND,
  }
}

function getCompanyBackgroundSuccess(response) {
  return {
    type: GET_COMPANY_BACKGROUND_SUCCESS,
    response
  }
}

function getCompanyBackgroundError(error) {
  return {
    type: GET_COMPANY_BACKGROUND_ERROR,
    error
  }
}