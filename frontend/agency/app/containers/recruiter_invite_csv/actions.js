/*
 *
 * RecruiterInviteCsv actions
 *
 */

import {
  INVITE_CSV_LOAD,
  INVITE_CSV_SUCCESS,
  INVITE_CSV_FAIL,
  CLEAN_UP_DATA,
  CHARGES_INVITE,
  CHARGES_INVITE_ERROR,
  CHARGES_INVITE_SUCCESS,
  CLEAN_CHARGES_INVITE
} from './constants';

import { inviteCSVRecruiter, chargesInviteRecruiterService } from 'services/api/userService';

export const inviteCSV = (agencyId, payload) => async dispatch => {
  try {
    dispatch(initInviteCSV());
    const res = await inviteCSVRecruiter(agencyId, payload);
    if (res?.data?.success) {
      dispatch(invitedCSV(res.data));
      // dispatch(cleanUpData())
    } else {
      dispatch(errorInviteCSV(res?.data?.error));
      // dispatch(cleanUpData())

    }
  } catch (error) {
    dispatch(errorInviteCSV(error));
  }
};

export function onChargesInviteAtion(agencyId, params) {
  return async dispatch => {
    try {
      dispatch(chargesInvite())
      const res = await chargesInviteRecruiterService(agencyId, params)
      if (res?.data?.success) {
        dispatch(chargesInviteSuccess(res?.data));
      }
      else {
        dispatch(chargesInviteError(res?.data?.error));
      }
    } catch (e) {
      dispatch(chargesInviteError(e));
    }
  }
}

export const cleanUpData = () => ({
  type: CLEAN_UP_DATA
})

export const initInviteCSV = () => ({
  type: INVITE_CSV_LOAD
});

export const invitedCSV = payload => ({
  type: INVITE_CSV_SUCCESS,
  payload
});

export const errorInviteCSV = payload => ({
  type: INVITE_CSV_FAIL,
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

