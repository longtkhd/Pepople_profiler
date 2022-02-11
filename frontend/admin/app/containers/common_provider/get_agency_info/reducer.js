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
        draft.error = null;
        draft.loading = true;
        draft.agencyInfo = null;
        break;
      case GET_AGENCY_INFO_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.agencyInfo = action.response?.data;
        break;
      case GET_AGENCY_INFO_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.agencyInfo = null;
        break;
      case GET_COMPANY_LOGO:
        draft.loadingLogo = true;
        draft.companyLogo = null;
        draft.error = null;
        break;
      case GET_COMPANY_LOGO_SUCCESS:
        draft.loadingLogo = false;
        draft.companyLogo = action.payload;
        draft.error = null;
        break;
      case GET_COMPANY_LOGO_ERROR:
        draft.loadingLogo = false;
        draft.companyLogo = null;
        draft.error = action.error;
        break;
      case GET_COMPANY_BACKGROUND:
        draft.loadingBackground = true;
        draft.companyBackground = null;
        draft.error = null;
        break;
      case GET_COMPANY_BACKGROUND_SUCCESS:
        draft.loadingBackground = false;
        draft.companyBackground = action.payload;
        draft.error = null;
        break;
      case GET_COMPANY_BACKGROUND_ERROR:
        draft.loadingBackground = false;
        draft.companyBackground = null;
        draft.error = action.error;
        break;
      default:
        break;
    }
  });

export default getAgencyInfoReducer;
