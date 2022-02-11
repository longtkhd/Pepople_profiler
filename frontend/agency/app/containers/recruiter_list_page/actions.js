/*
 *
 * RecruiterListPage actions
 *
 */

import { 
  GET_RECRUITER,
  GET_RECRUITER_SUCCESS,
  GET_RECRUITER_ERROR,
  GET_SUBSCRIPTION_INFO,
  GET_SUBSCRIPTION_INFO_SUCCESS,
  GET_SUBSCRIPTION_INFO_ERROR  ,
  RE_INVITE_RECRUITER_REQUEST,
  RE_INVITE_RECRUITER_SUCCESS,
  RE_INVITE_RECRUITER_ERROR
} from './constants';
import { getRecruiters, getSubscriptionInfo } from 'services/api/agencyService';
import { reInviteRecruiterService } from 'services/api/recruiterService';

function getRecruiterAction() {
  return {
    type: GET_RECRUITER,
  };
}

function getRecruiterSuccess(payload) {
  return {
    type: GET_RECRUITER_SUCCESS,
    payload
  };
}

function getRecruiterError(error) {
  return {
    type: GET_RECRUITER_ERROR,
    error
  };
}
function reInviteRecruiterRequest() {
  return {
    type: RE_INVITE_RECRUITER_REQUEST,
  };
}

function reInviteRecruiterSuccess(response) {
  return {
    type: RE_INVITE_RECRUITER_SUCCESS,
    response
  };
}

function reInviteRecruiterError(error) {
  return {
    type: RE_INVITE_RECRUITER_ERROR,
    error
  };
}

function getSubscriptionInfoAction() {
  return {
    type: GET_SUBSCRIPTION_INFO,
  };
}

function getSubscriptionInfoSuccess(payload) {
  return {
    type: GET_SUBSCRIPTION_INFO_SUCCESS,
    payload
  };
}

function getSubscriptionInfoError(error) {
  return {
    type: GET_SUBSCRIPTION_INFO_ERROR,
    error
  };
}

export const getRecruiterList = (agencyId, data) => {
  return async dispatch => {
    try {
      dispatch(getRecruiterAction());
      const response = await getRecruiters(agencyId, data);
      dispatch(getRecruiterSuccess(response.data));
    } catch (err) {
      dispatch(getRecruiterError(err.response?.data));
    }
  }
}

export const getSubscription = agencyId => {
  return async dispatch => {
    try {
      dispatch(getSubscriptionInfoAction());
      const response = await getSubscriptionInfo(agencyId);
      dispatch(getSubscriptionInfoSuccess(response.data));
    } catch (err) {
      dispatch(getSubscriptionInfoError(err.response?.data));
    }
  }
}
export const resetStatusReInviteAction = () => {
  return  dispatch => {
      dispatch(resetStatusReInviteRequest());
    
  
  }
}
export const reInviteRecruiterAction = recruiterId => {
  return async dispatch => {
    try {
      dispatch(reInviteRecruiterRequest());
      const response = await reInviteRecruiterService(recruiterId);
      dispatch(reInviteRecruiterSuccess(response.data));
    } catch (err) {
      dispatch(reInviteRecruiterError(err.response?.data));
    }
  }
}