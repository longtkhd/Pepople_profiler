/*
 *
 * CLIENT INVITE CONTACT JOB  actions
 *
 */

import {
  INIT_INVITE_CONTACT_JOB,
  INVITE_CONTACT_JOB_SUCCESS,
  INVITE_CONTACT_JOB_FAIL,
  CLEAN_UP_INVITE_CONTACT_JOB,
  INVITE_ALL,
  INVITE_ALL_ERROR,
  INVITE_ALL_SUCCESS
} from './constants';

import * as clientService from 'services/api/clientService';
// deleteContactListDetail
export const inviteContactOnJob = (
  contactId,
  jobId,
  params,
) => async dispatch => {
  try {
    dispatch(initInviteContact());
    const res = await clientService.inviteContactOnJob(
      contactId,
      jobId,
      params,
    );
    dispatch(inviteContactOnJobSuccess(res.data));
      dispatch(cleanInviteContact())
  } catch (error) {
    dispatch(inviteContactOnJobError(error));
  }
};

export const inviteAllAction = (
  jobId,
  params,
) => async dispatch => {
  try {
    dispatch(inviteAll());
    const res = await clientService.inviteAllService(
      jobId,
      params,
    );
    if (res?.data?.success) {
      dispatch(inviteAllSuccess(res?.data));
    
    }
    else dispatch(inviteAllError(res?.data?.error))
  } catch (error) {
    dispatch(dispatch(inviteAllError(error?.response?.message)));
  }
};

export const initInviteContact = () => ({
  type: INIT_INVITE_CONTACT_JOB,
});

export const inviteContactOnJobSuccess = payload => ({
  type: INVITE_CONTACT_JOB_SUCCESS,
  payload,
});

export const inviteContactOnJobError = payload => ({
  type: INVITE_CONTACT_JOB_FAIL,
  payload,
});

export const cleanInviteContact = () => ({
  type: CLEAN_UP_INVITE_CONTACT_JOB,
});

export const inviteAll = () => ({
  type: INVITE_ALL,
});

export const inviteAllSuccess = payload => ({
  type: INVITE_ALL_SUCCESS,
  payload,
});

export const inviteAllError = error => ({
  type: INVITE_ALL_ERROR,
  error,
});



