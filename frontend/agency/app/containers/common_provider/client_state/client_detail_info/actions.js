/*
 *
 * CLIENT DETAIL  actions
 *
 */

import {
  INIT_GET_CLIENT_DETAIL,
  GET_CLIENT_DETAIL_SUCCESS,
  GET_CLIENT_DETAIL_FAIL,
  CLEAN_CLIENT_DETAIL,
} from './constants';

import * as clientService from 'services/api/clientService';

export const getClientDetailInfo = (
  clientId,
  params,
) => async dispatch => {
  try {
    dispatch(initGetDetailInfo());
    const res = await clientService.getClientDetail(clientId, params);
    dispatch(getClientDetailSuccess(res.data));
  } catch (error) {
    dispatch(getClientDetailError(error));
  }
};

export const initGetDetailInfo = () => ({
  type: INIT_GET_CLIENT_DETAIL,
});

export const getClientDetailSuccess = payload => ({
  type: GET_CLIENT_DETAIL_SUCCESS,
  payload,
});

export const getClientDetailError = payload => ({
  type: GET_CLIENT_DETAIL_FAIL,
  payload,
});

export const cleanClientDetail = () => ({
  type: CLEAN_CLIENT_DETAIL,
});
