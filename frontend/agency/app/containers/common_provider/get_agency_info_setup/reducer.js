/*
 *
 * Get user info reducer
 *
 */
import produce from 'immer';
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

export const initialState = {
  agencyInfoLoading: false,
  agencyInfoError: null,
  agencyInfo: null,
  loadingLogo: false,
  errorLogo: null,
  loadingBackground: false,
  errorBackground: null,
  companyLogo: null,
  companyBackground: null,
};

/* eslint-disable default-case, no-param-reassign */
const getAgencyInfoSetupReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_AGENCY_INFO:
        draft.agencyInfoError = null;
        draft.agencyInfoLoading = true;
        draft.agencyInfo = null;
        break;
      case GET_AGENCY_INFO_SUCCESS:
        draft.agencyInfoError = null;
        draft.agencyInfoLoading = false;
        draft.agencyInfo = action.response?.data;
        break;
      case GET_AGENCY_INFO_ERROR:
        draft.agencyInfoError = action.error;
        draft.agencyInfoLoading = false;
        draft.agencyInfo = null;
        break;
      case GET_COMPANY_LOGO:
        draft.loadingLogo = true;
        draft.companyLogo = null;
        draft.errorLogo = null;
        break;
      case GET_COMPANY_LOGO_SUCCESS:
        draft.loadingLogo = false;
        draft.companyLogo = action.response;
        draft.errorLogo = null;
        break;
      case GET_COMPANY_LOGO_ERROR:
        draft.loadingLogo = false;
        draft.companyLogo = null;
        draft.errorLogo = action.error;
        break;
      case GET_COMPANY_BACKGROUND:
        draft.loadingBackground = true;
        draft.companyBackground = null;
        draft.errorBackground = null;
        break;
      case GET_COMPANY_BACKGROUND_SUCCESS:
        draft.loadingBackground = false;
        draft.companyBackground = action.response;
        draft.errorBackground = null;
        break;
      case GET_COMPANY_BACKGROUND_ERROR:
        draft.loadingBackground = false;
        draft.companyBackground = null;
        draft.errorBackground = action.error;
        break;
      default:
        break;
    }
  });

export default getAgencyInfoSetupReducer;
