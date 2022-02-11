/*
 *
 * CreateJobState actions
 *
 */

import {
  CREATE_NEW_JOB_INIT,
  CREATE_NEW_JOB_SUCCESS,
  CREATE_NEW_JOB_FAIL,
  GET_BUSINESS,
  GET_CONTACT,
  CLEAN_UP,
} from './constants';

import * as jobService from 'services/api/jobService';

export const createJob = (agencyId,data) => async dispatch => {
  try {
    dispatch(createInit());
    const res = await jobService.createJob(agencyId,data);
    dispatch(createSuccess(res.data));
  } catch (error) {
    dispatch(createError(error));
  }
}

export const createInit = () => ({
  type: CREATE_NEW_JOB_INIT,
});

export const createSuccess = payload => ({
  type: CREATE_NEW_JOB_SUCCESS,
  payload
});

export const createError = payload => ({
  type: CREATE_NEW_JOB_FAIL,
  payload
});


export const getClientBusiness = payload => ({
  type: GET_BUSINESS,
  payload
});

export const getContactDetail = payload => ({
  type: GET_CONTACT,
  payload
});

export const cleanUp = () => ({
  type: CLEAN_UP,
})
