/*
 *
 * CLIENT DELETE CONTACT LIST DETAIL  actions
 *
 */

import {
  INIT_EDIT_CONTACT_CLIENT,
  EDIT_CONTACT_CLIENT_SUCCESS,
  EDIT_CONTACT_CLIENT_FAIL,
  CLEAN_UP_EDIT_CONTACT_CLIENT,
} from './constants';

import * as clientService from 'services/api/clientService';
// deleteContactListDetail
export const editClientContact = (clientId,payload,params) => async dispatch => {
  try {
    dispatch(initEditClientContact());
    const res = await clientService.editClientContact(clientId,payload,params);
    dispatch(editClientContactSuccess(res.data));
  } catch (error) {
    dispatch(editClientContactError(error));
  }
}

export const initEditClientContact = () => ({
  type: INIT_EDIT_CONTACT_CLIENT,
});

export const editClientContactSuccess = payload => ({
  type: EDIT_CONTACT_CLIENT_SUCCESS,
  payload
});

export const editClientContactError = payload => ({
  type: EDIT_CONTACT_CLIENT_FAIL,
  payload
});


export const cleanUpEditClientContact = () => ({
  type: CLEAN_UP_EDIT_CONTACT_CLIENT,
});

