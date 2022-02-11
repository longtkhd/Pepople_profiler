/*
 *
 * ClientDetailPage actions
 *
 */

import {
  FETCH_CLIENT_DETAIL,
  RECEIVE_CLIENT_DETAIL,
  FAIL_CLIENT_DETAIL,
  CLEAN_CLIENT_DETAIL
} from './constants';
import * as clientService from 'services/api/clientService';

// client detail
export const fetchClientDetail = (clientId, params) => async dispatch => {
  try {
    dispatch(loadClienDetail());
    const res = await clientService.getClientDetail(clientId, params);
    // console.log('a', res.data)
    dispatch(receiveClientDetail(res.data));
  } catch (error) {
    dispatch(errorClientDetail(error));
  }
}

export const loadClienDetail = () => ({
  type: FETCH_CLIENT_DETAIL
});

export const receiveClientDetail = payload => ({
  type: RECEIVE_CLIENT_DETAIL,
  payload
});

export const errorClientDetail = payload => ({
  type: FAIL_CLIENT_DETAIL,
  payload
});

export const cleanClientDetail = () => ({
  type: CLEAN_CLIENT_DETAIL
});
