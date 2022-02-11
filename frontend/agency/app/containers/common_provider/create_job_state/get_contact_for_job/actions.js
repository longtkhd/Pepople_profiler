/*
 *
 * GET CONTACT FOR JOB actions
 *
 */

import {
  INIT_GET_CONTACT_JOB,
  GET_CONTACT_JOB_SUCCESS,
  GET_CONTACT_JOB_FAIL,
  CLEAN_CONTACT_JOB,
} from './constants';

import * as jobService from 'services/api/jobService';

export const getAvailableContactJob = (agencyId,jobId,param) => async dispatch => {
  try {
    dispatch(initGetAvailableContact());
    const res = await jobService.getContactListForJob(agencyId,jobId,param);
    dispatch(getAvailableContactJobSuccess(res.data));
  } catch (error) {
    dispatch(getAvailableContactJobError(error));
  }
}

export const initGetAvailableContact = () => ({
  type: INIT_GET_CONTACT_JOB,
});

export const getAvailableContactJobSuccess = payload => ({
  type: GET_CONTACT_JOB_SUCCESS,
  payload
});

export const getAvailableContactJobError = payload => ({
  type: GET_CONTACT_JOB_FAIL,
  payload
});

export const cleanAvailableJob = () => ({
  type: CLEAN_CONTACT_JOB,
});

