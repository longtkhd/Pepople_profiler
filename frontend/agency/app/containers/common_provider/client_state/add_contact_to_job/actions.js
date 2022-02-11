/*
 *
 * CLIENT ADD CONTACT TO JOB  actions
 *
 */

import {
  INIT_ADD_CONTACT_TO_JOB,
  ADD_CONTACT_TO_JOB_SUCCESS,
  ADD_CONTACT_TO_JOB_FAIL,
  CLEAN_UP_ADD_CONTACT_TO_JOB,
} from './constants';

import * as clientService from 'services/api/clientService';
// deleteContactListDetail
export const addContactToJob = (contactId, jobId, params) => async dispatch => {
  try {
    dispatch(initAddContactToJob());
    const res = await clientService.addContactToCurrentJob(
      contactId,
      jobId,
      params,
    );
    dispatch(addContactToJobSuccess(res.data));
  } catch (error) {
    dispatch(addContactToJobError(error));
  }
};

export const initAddContactToJob = () => ({
  type: INIT_ADD_CONTACT_TO_JOB,
});

export const addContactToJobSuccess = payload => ({
  type: ADD_CONTACT_TO_JOB_SUCCESS,
  payload,
});

export const addContactToJobError = payload => ({
  type: ADD_CONTACT_TO_JOB_FAIL,
  payload,
});

export const cleanAddContactToJob = () => ({
  type: CLEAN_UP_ADD_CONTACT_TO_JOB,
});
