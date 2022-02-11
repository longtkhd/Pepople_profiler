/*
 *
 * GET CONTACT IN JOB actions
 *
 */

import {
  INIT_GET_CONTACT_IN_JOB,
  GET_CONTACT_IN_JOB_SUCCESS,
  GET_CONTACT_IN_JOB_FAIL,
  CLEAN_CONTACT_IN_JOB,
} from './constants';

import * as jobService from 'services/api/jobService';

export const getContactInJob = (agencyId,jobId,param) => async dispatch => {
  try {
    dispatch(initGetContact());
    const res = await jobService.getContactListInJob(agencyId,jobId,param);
    dispatch(getContactInJobSuccess(res.data));
  } catch (error) {
    dispatch(getContactInJobError(error));
  }
}

export const initGetContact = () => ({
  type: INIT_GET_CONTACT_IN_JOB,
});

export const getContactInJobSuccess = payload => ({
  type: GET_CONTACT_IN_JOB_SUCCESS,
  payload
});

export const getContactInJobError = payload => ({
  type: GET_CONTACT_IN_JOB_FAIL,
  payload
});

export const cleanContactInJob = () => ({
  type: CLEAN_CONTACT_IN_JOB,
});

