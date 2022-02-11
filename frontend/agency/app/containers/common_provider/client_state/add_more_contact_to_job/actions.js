/*
 *
 * CLIENT MORE ADD CONTACT TO JOB  actions
 *
 */

import {
  INIT_ADD_MORE_CONTACT_TO_JOB,
  ADD_MORE_CONTACT_TO_JOB_SUCCESS,
  ADD_MORE_CONTACT_TO_JOB_FAIL,
  CLEAN_UP_ADD_MORE_CONTACT,
} from './constants';

import * as clientService from 'services/api/clientService';
// deleteContactListDetail
export const addMoreContactToJob =  (jobId,payload,params) => async dispatch => {
  try {
    dispatch(initAddMoreContact());
    const res = await clientService.addMoreContactJob(
      jobId,
      payload,
      params,
    );
    dispatch(addMoreContactSuccess(res.data));
  } catch (error) {
    dispatch(addMoreContactError(error));
  }
};

export const initAddMoreContact = () => ({
  type: INIT_ADD_MORE_CONTACT_TO_JOB,
});

export const addMoreContactSuccess = payload => ({
  type: ADD_MORE_CONTACT_TO_JOB_SUCCESS,
  payload,
});

export const addMoreContactError = payload => ({
  type: ADD_MORE_CONTACT_TO_JOB_FAIL,
  payload,
});

export const cleanAddMoreContact = () => ({
  type: CLEAN_UP_ADD_MORE_CONTACT,
});
