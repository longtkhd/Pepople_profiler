/*
 *
 * GET JOBS actions
 *
 */

import {
  DELETE_JOB_INIT,
  DELETE_JOB_SUCCESS,
  DELETE_JOB_FAIL,
  CLEAN_DELETE_JOB,
} from './constants';

import * as jobService from 'services/api/jobService';

export const deleteJob = (jobId,param) => async dispatch => {
  try {
    dispatch(initDeleteJob());
    const res = await jobService.deleteJobDetail(jobId,param);
    dispatch(receiveDeleteJob(res.data));
  } catch (error) {
    dispatch(errorDeleteJob(error));
  }
}

export const initDeleteJob = () => ({
  type: DELETE_JOB_INIT,
});

export const receiveDeleteJob = payload => ({
  type: DELETE_JOB_SUCCESS,
  payload
});

export const errorDeleteJob = payload => ({
  type: DELETE_JOB_FAIL,
  payload
});

export const cleanDeleteJob = () => ({
  type: CLEAN_DELETE_JOB,
});

