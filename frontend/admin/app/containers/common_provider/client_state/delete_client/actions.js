/*
 *
 * CLIENT DELETE CONTACT LIST DETAIL  actions
 *
 */

import {
  INIT_DELETE_CLIENT,
  DELETE_CLIENT_SUCCESS,
  DELETE_CLIENT_FAIL,
  CLEAN_UP_DELETE,
} from './constants';

import * as clientService from 'services/api/clientService';
// deleteContactListDetail
export const deleteClient = (clientId, param) => async dispatch => {
  try {
    dispatch(initDeleteClient());
    const res = await clientService.deleteClient(clientId, param);
    dispatch(deleteClientSuccess(res.data));
  } catch (error) {
    dispatch(deleteClientError(error));
  }
}

export const initDeleteClient = () => ({
  type: INIT_DELETE_CLIENT,
});

export const deleteClientSuccess = payload => ({
  type: DELETE_CLIENT_SUCCESS,
  payload
});

export const deleteClientError = payload => ({
  type: DELETE_CLIENT_FAIL,
  payload
});

export const cleanUpDeleteClient = () => ({
  type: CLEAN_UP_DELETE,
});

