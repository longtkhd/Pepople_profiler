/*
 *
 * Client actions
 *
 */

import {
  FETCH_CLIENT_LIST,
  RECEIVE_CLIENT_LIST,
  FAIL_CLIENT_LIST,
  CLEAN_CLIENT_LIST,
  FETCH_CONTACT_LIST_DETAIL,
  RECEIVE_CONTACT_LIST_DETAIL,
  FAIL_CONTACT_LIST_DETAIL,
  CLEAN_CONTACT_LIST_DETAIL,
} from './constants';
import * as clientService from 'services/api/clientService';
// getClientContactDetail

// client list
export const fetchClientList = (agencyId,params) => async dispatch => {
  try {
    dispatch(loadClient());
    const res = await clientService.getListclient(agencyId,params);
    dispatch(receiveClient(res.data));
  } catch (error) {
    dispatch(errorClient(error));
  }
}

export const loadClient = () => ({
  type: FETCH_CLIENT_LIST
});

export const receiveClient = payload => ({
  type: RECEIVE_CLIENT_LIST,
  payload
});

export const errorClient = payload => ({
  type: FAIL_CLIENT_LIST,
  payload
});

export const cleanClientList = () => ({
  type: CLEAN_CLIENT_LIST,
});

//client contact detail
export const fetchContactListDetail = (clientId,params) => async dispatch => {
  try {
    dispatch(loadContactListDetail());
    const res = await clientService.getClientContactDetail(clientId,params);
    dispatch(receiveContactListDetail(res.data));
  } catch (error) {
    dispatch(errorContactListDetail(error));
  }
};

export const loadContactListDetail = () => ({
  type: FETCH_CONTACT_LIST_DETAIL,
});

export const receiveContactListDetail = payload => ({
  type: RECEIVE_CONTACT_LIST_DETAIL,
  payload
});

export const errorContactListDetail = payload => ({
  type: FAIL_CONTACT_LIST_DETAIL,
  payload
});

export const cleanContactListDetail = () => ({
  type: CLEAN_CONTACT_LIST_DETAIL,
});

