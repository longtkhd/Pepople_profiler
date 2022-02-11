/*
 *
 * ClientCreatePage actions
 *
 */

import {
  CREATE_CLIENT_INIT,
  CREATE_CLIENT_SUCCESS,
  CREATE_CLIENT_ERROR,
  CLEAN_UP_DATA,
} from './constants';

import * as clientService from 'services/api/clientService';

export const createClient = (data,param) => async dispatch => {
  
  try {
    dispatch(initCreate());
    const res = await clientService.createClient(data,param);
    dispatch(createSuccess(res.data));
  } catch (error) {
    dispatch(createError(error));
  }
}

export const initCreate = () => ({
  type: CREATE_CLIENT_INIT,
});

export const createSuccess = payload => ({
  type: CREATE_CLIENT_SUCCESS,
  payload
});

export const createError = payload => ({
  type: CREATE_CLIENT_ERROR,
  payload
});

export const cleanUp = () => ({
  type: CLEAN_UP_DATA,
});
