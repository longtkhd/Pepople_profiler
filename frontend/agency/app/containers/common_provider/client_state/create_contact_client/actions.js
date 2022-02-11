/*
 *
 * CLIENT CREATE CONTACT  actions
 *
 */

import {
  INIT_CREATE_CONTACT_CLIENT,
  CREATE_CONTACT_CLIENT_SUCCESS,
  CREATE_CONTACT_CLIENT_FAIL,
  CLEAN_CREATE_CONTACT_CLIENT,
} from './constants';

import * as clientService from 'services/api/clientService';

export const addContactToClient = (
  clientId,
  payload,
  params,
) => async dispatch => {
  try {
    dispatch(initCreateContactClient());
    const res = await clientService.clientCreateContact(
      clientId,
      payload,
      params,
    );
    dispatch(createConctactClientSuccess(res.data));
  } catch (error) {
    dispatch(createConctactClientError(error));
  }
};

export const initCreateContactClient = () => ({
  type: INIT_CREATE_CONTACT_CLIENT,
});

export const createConctactClientSuccess = payload => ({
  type: CREATE_CONTACT_CLIENT_SUCCESS,
  payload,
});

export const createConctactClientError = payload => ({
  type: CREATE_CONTACT_CLIENT_FAIL,
  payload,
});

export const cleanCreateContact = () => ({
  type: CLEAN_CREATE_CONTACT_CLIENT,
});
