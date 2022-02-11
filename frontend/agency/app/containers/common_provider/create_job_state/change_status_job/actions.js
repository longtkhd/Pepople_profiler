/*
 *
 * CHANGE STATUS JOB actions
 *
 */

import {
  CHANGE_STATUS_JOB_INIT,
  CHANGE_STATUS_JOB_SUCCESS,
  CHANGE_STATUS_JOB_FAIL,
  CLEAN_CHANGE_STATUS_JOB,
} from './constants';

import * as jobService from 'services/api/jobService';

export const changeStatusJob = (agencyId,payload,param) => async dispatch => {
  try {
    dispatch(initChangeStatusJob());
    const res = await jobService.changeStatusJob(agencyId,payload,param);
    dispatch(changeStatusJobSuccess(res.data));
  } catch (error) {
    dispatch(changeStatusJobFail(error));
  }
}

export const initChangeStatusJob = () => ({
  type: CHANGE_STATUS_JOB_INIT,
});

export const changeStatusJobSuccess = payload => ({
  type: CHANGE_STATUS_JOB_SUCCESS,
  payload
});

export const changeStatusJobFail = payload => ({
  type: CHANGE_STATUS_JOB_FAIL,
  payload
});

export const cleanChangeStatusJob = () => ({
  type: CLEAN_CHANGE_STATUS_JOB,
});

