/*
 *
 * GET JOBS actions
 *
 */

import {
  FETCH_OPEN_JOB,
  GET_OPEN_JOB_SUCCESS,
  GET_OPEN_JOB_FAIL,
  CLEAN_OPEN_JOB,
} from './constants';

import * as jobService from 'services/api/jobService';

export const getJobs = (agencyId, param) => async dispatch => {
  try {
    dispatch(initOpenJob());
    const res = await jobService.getJobList(agencyId, param);
    dispatch(receiveOpenJob(res.data));
  } catch (error) {
    dispatch(errorOpenJob(error));
  }
}

export const initOpenJob = () => ({
  type: FETCH_OPEN_JOB,
});

export const receiveOpenJob = payload => ({
  type: GET_OPEN_JOB_SUCCESS,
  payload
});

export const errorOpenJob = payload => ({
  type: GET_OPEN_JOB_FAIL,
  payload
});


export const clienOpenJob = () => ({
  type: CLEAN_OPEN_JOB,
});

