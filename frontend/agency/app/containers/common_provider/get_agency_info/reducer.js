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
  CLEAR_AGENCY_INFO,
  CLEAR_COMPANY_LOGO,
  CLEAR_COMPANY_BACKGROUND
} from './constants';

export const initialState = {
  loadingAgency: false,
  errorAgency: null,
  loadingLogo: false,
  errorLogo: null,
  loadingBackground: false,
  errorBackground: null,
  agencyInfo: null,
  companyLogo: null,
  companyBackground: null,
};

/* eslint-disable default-case, no-param-reassign */
const getAgencyInfoReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_AGENCY_INFO:
        draft.errorAgency = null;
        draft.loadingAgency = true;
        draft.agencyInfo = null;
        break;
      case GET_AGENCY_INFO_SUCCESS:
        draft.errorAgency = null;
        draft.loadingAgency = false;
        draft.agencyInfo = action.response?.data;
        break;
      case GET_AGENCY_INFO_ERROR:
        draft.errorAgency = { message: 'Get agency details unsuccessfully' };
        draft.loadingAgency = false;
        draft.agencyInfo = null;
        break;
      case GET_COMPANY_LOGO:
        draft.loadingLogo = true;
        draft.companyLogo = null;
        draft.errorLogo = null;
        break;
      case GET_COMPANY_LOGO_SUCCESS:
        draft.loadingLogo = false;
        draft.companyLogo = action.payload;
        draft.errorLogo = null;
        break;
      case GET_COMPANY_LOGO_ERROR:
        draft.loadingLogo = false;
        draft.companyLogo = null;
        draft.errorLogo = { message: 'Get company logo unsuccessfully.' };
        break;
      case GET_COMPANY_BACKGROUND:
        draft.loadingBackground = true;
        draft.companyBackground = null;
        draft.errorBackground = null;
        break;
      case GET_COMPANY_BACKGROUND_SUCCESS:
        draft.loadingBackground = false;
        draft.companyBackground = action.payload;
        draft.errorBackground = null;
        break;
      case GET_COMPANY_BACKGROUND_ERROR:
        draft.loadingBackground = false;
        draft.companyBackground = null;
        draft.errorBackground = { message: 'Get company background unsuccessfully.' };
        break;
      case CLEAR_AGENCY_INFO:
        draft.agencyInfo = null;
        draft.errorAgency = null;
        draft.loadingAgency = false;
        break
      case CLEAR_COMPANY_LOGO:
        draft.companyLogo = null;
        draft.loadingLogo = false;
        draft.errorLogo = null;
        break;
      case CLEAR_COMPANY_BACKGROUND:
        draft.companyBackground = null;
        draft.loadingBackground = false;
        draft.errorBackground = null;
        break;
      default:
        break;
    }
  });

export default getAgencyInfoReducer;
