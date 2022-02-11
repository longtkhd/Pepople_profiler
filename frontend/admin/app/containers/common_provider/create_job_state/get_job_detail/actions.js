/*
 *
 * GET JOB DETAIL actions
 *
 */

import {
  GET_JOB_DETAIL_INIT,
  GET_JOB_DETAIL_SUCCESS,
  GET_JOB_DETAIL_FAIL,
  CLEAN_UP,
} from './constants';

import * as jobService from 'services/api/jobService';

export const getJobDetail = (agencyId,jobId,param) => async dispatch => {
  try {
    dispatch(initGetJobDetail());
    const res = await jobService.getJobDetail(agencyId,jobId,param);
    dispatch(receiveJobDetail(res.data));
  } catch (error) {
    dispatch(errorGetJobDetail(error));
  }
}

export const initGetJobDetail = () => ({
  type: GET_JOB_DETAIL_INIT,
});

export const receiveJobDetail = payload => ({
  type: GET_JOB_DETAIL_SUCCESS,
  payload
});

export const errorGetJobDetail = payload => ({
  type: GET_JOB_DETAIL_FAIL,
  payload
});


export const cleanUpJobDetail = () => ({
  type: CLEAN_UP,
});

