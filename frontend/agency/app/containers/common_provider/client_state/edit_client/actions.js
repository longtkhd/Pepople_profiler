/*
 *
 * CLIENT DELETE CONTACT LIST DETAIL  actions
 *
 */

import {
  INIT_EDIT_CLIENT,
  EDIT_CLIENT_SUCCESS,
  EDIT_CLIENT_FAIL,
  CLEAN_UP_EDIT_CLIENT,
} from './constants';

import * as clientService from 'services/api/clientService';
// deleteContactListDetail
export const editClient = (clientId,payload,params) => async dispatch => {
  try {
    dispatch(initEditClient());
    const res = await clientService.editClient(clientId,payload,params);
    dispatch(editClientSuccess(res.data));
  } catch (error) {
    dispatch(editContactError(error));
  }
}

export const initEditClient = () => ({
  type: INIT_EDIT_CLIENT,
});

export const editClientSuccess = payload => ({
  type: EDIT_CLIENT_SUCCESS,
  payload
});

export const editContactError = payload => ({
  type: EDIT_CLIENT_FAIL,
  payload
});


export const cleanUpEditClient = () => ({
  type: CLEAN_UP_EDIT_CLIENT,
});

