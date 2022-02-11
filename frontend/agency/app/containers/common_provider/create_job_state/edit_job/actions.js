/*
 *
 * EDIT JOB actions
 *
 */

import {
  EDIT_JOB_INIT,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_FAIL,
  CLEAN_EDIT_JOB,
} from './constants';

import * as jobService from 'services/api/jobService';

export const editJob = (jobId,param) => async dispatch => {
  try {
    dispatch(initEditJob());
    const res = await jobService.editJobDetail(jobId,param);
    dispatch(receiveEditJob(res.data));
  } catch (error) {
    dispatch(errorEditJob(error));
  }
}

export const initEditJob = () => ({
  type: EDIT_JOB_INIT,
});

export const receiveEditJob = payload => ({
  type: EDIT_JOB_SUCCESS,
  payload
});

export const errorEditJob = payload => ({
  type: EDIT_JOB_FAIL,
  payload
});


export const cleanEditJob = () => ({
  type: CLEAN_EDIT_JOB,
});

