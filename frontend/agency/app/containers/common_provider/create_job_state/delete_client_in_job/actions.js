/*
 *
 * DEELTE CONTACT IN JOBS actions
 *
 */

import {
  INIT_DELETE_CONTACT_JOB,
  DELETE_CONTACT_JOB_SUCCESS,
  DELETE_CONTACT_JOB_FAIL,
  CLEAN_DELETE_CONTACT_JOB,
} from './constants';

import * as jobService from 'services/api/jobService';

export const deleteContactInJob = (jobId,contactId,params) => async dispatch => {
  try {
    dispatch(initDeleteContactJob());
    const res = await jobService.deleteContactInJob(jobId,contactId,params);
    dispatch(deleteContactJobSuccess(res.data));
  } catch (error) {
    dispatch(deleteContactJobError(error));
  }
}

export const initDeleteContactJob = () => ({
  type: INIT_DELETE_CONTACT_JOB,
});

export const deleteContactJobSuccess = payload => ({
  type: DELETE_CONTACT_JOB_SUCCESS,
  payload
});

export const deleteContactJobError = payload => ({
  type: DELETE_CONTACT_JOB_FAIL,
  payload
});

export const cleanDeleteContactJob = () => ({
  type: CLEAN_DELETE_CONTACT_JOB,
});

