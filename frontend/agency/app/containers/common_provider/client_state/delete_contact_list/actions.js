/*
 *
 * CLIENT DELETE CONTACT LIST DETAIL  actions
 *
 */

import {
  INIT_DELETE_CONTACT_DETAIL,
  DELETE_CONTACT_DETAIL_SUCCESS,
  DELETE_CONTACT_DETAIL_FAIL,
  CLEANUP_CONTACT_DETAIL_FAIL,
} from './constants';

import * as clientService from 'services/api/clientService';
// deleteContactListDetail
export const deleteContactDetail = (clientId, contactId ,param) => async dispatch => {
  try {
    dispatch(initDeleteContact());
    const res = await clientService.deleteContactListDetail(clientId, contactId ,param);
    dispatch(deleteContactSuccess(res.data));
  } catch (error) {
    dispatch(deleteContactError(error));
  }
}

export const initDeleteContact = () => ({
  type: INIT_DELETE_CONTACT_DETAIL,
});

export const deleteContactSuccess = payload => ({
  type: DELETE_CONTACT_DETAIL_SUCCESS,
  payload
});

export const deleteContactError = payload => ({
  type: DELETE_CONTACT_DETAIL_FAIL,
  payload
});


export const cleanUpDeleteContact = () => ({
  type: CLEANUP_CONTACT_DETAIL_FAIL,
});

