/*
 *
 * RecruiterInvite actions
 *
 */

import {
  INVITED,
  INVITE_LOAD_ON,
  INVITE_LOAD_OFF,
  INVITE_ERROR,
  CLEAN_UP_DATA,
  CHARGES_INVITE, CHARGES_INVITE_SUCCESS, CHARGES_INVITE_ERROR, CLEAN_CHARGES_INVITE,
} from './constants'
import * as userService from 'services/api/userService';

export const inviteRecruiter = (agency_id,data) => async dispatch => {
  try {
    dispatch({ type: INVITE_LOAD_ON});
    const res = await userService.inviteRecruiter(agency_id,data);
    if(res?.data?.success){
      dispatch(invitedRecruiter(res.data));
    }else{
      dispatch(inviteError(res?.data?.error))
    }
    dispatch({ type: INVITE_LOAD_OFF});
  } catch (err) {
    dispatch(inviteError(err));
    dispatch({ type: INVITE_LOAD_OFF});
  }
};

export function onChargesInviteAtion(agencyId, params){
  return async dispatch => {
    try {
      dispatch(chargesInvite())
      const res = await userService.chargesInviteRecruiterService(agencyId, params)
      if(res?.data?.success){
        dispatch(chargesInviteSuccess(res?.data));
      }
      else {
        dispatch(chargesInviteError(res?.data?.error));
      }
    }catch (e) {
      dispatch(chargesInviteError(e));
    }
  }
}

export const cleanUpData = () => ({
  type: CLEAN_UP_DATA
});

export const invitedRecruiter = payload => ({
  type: INVITED,
  payload
});

export const inviteError = payload => ({
  type: INVITE_ERROR,
  payload
});

function chargesInvite() {
  return {
    type: CHARGES_INVITE,
  }
}

function chargesInviteSuccess(payload) {
  return {
    type: CHARGES_INVITE_SUCCESS,
    payload
  }
}

function chargesInviteError(error) {
  return {
    type: CHARGES_INVITE_ERROR,
    error
  }
}

export function cleanChargesInviteAction() {
  return {
    type: CLEAN_CHARGES_INVITE
  }
}
