import {
  CHARGES_INVITE,
  CHARGES_INVITE_SUCCESS,
  CHARGES_INVITE_ERROR,
  CLEAN_CHARGES_INVITE,
} from './constants';
import * as userService from 'services/api/userService';

export function onChargesInviteAtion(agencyId, params) {
  return async dispatch => {
    try {
      dispatch(chargesInvite());
      const res = await userService.chargesInviteRecruiterService(
        agencyId,
        params,
      );
      if (res?.data?.success) {
        dispatch(chargesInviteSuccess(res?.data));
        dispatch(cleanChargesInviteAction());
      } else {
        dispatch(chargesInviteError(res?.data?.error));
        dispatch(cleanChargesInviteAction());
      }
    } catch (e) {
      dispatch(chargesInviteError(e));
      dispatch(cleanChargesInviteAction());
    }
  };
}

function chargesInvite() {
  return {
    type: CHARGES_INVITE,
  };
}

function chargesInviteSuccess(payload) {
  return {
    type: CHARGES_INVITE_SUCCESS,
    payload,
  };
}

function chargesInviteError(error) {
  return {
    type: CHARGES_INVITE_ERROR,
    error,
  };
}

export function cleanChargesInviteAction() {
  return {
    type: CLEAN_CHARGES_INVITE,
  };
}
