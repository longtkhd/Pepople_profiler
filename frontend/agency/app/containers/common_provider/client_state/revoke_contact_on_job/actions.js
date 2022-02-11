import {
  revokeAllService,
  revokeClientService,
} from 'services/api/clientService';
import {
  REVOKE_ALL,
  REVOKE_ALL_ERROR,
  REVOKE_ALL_SUCCESS,
  REVOKE_CLIENT,
  REVOKE_CLIENT_ERROR,
  REVOKE_CLIENT_SUCCESS,
  CLEAR_REVOKED,
} from './constants';

function revokeClient() {
  return {
    type: REVOKE_CLIENT,
  };
}

function revokeClientSuccess(payload) {
  return {
    type: REVOKE_CLIENT_SUCCESS,
    payload,
  };
}

function revokeClientError(error) {
  return {
    type: REVOKE_CLIENT_ERROR,
    error,
  };
}

function revokeAll(params) {
  return {
    type: REVOKE_ALL,
  };
}

function revokeAllSuccess(payload) {
  return {
    type: REVOKE_ALL_SUCCESS,
    payload,
  };
}

function revokeAllError(error) {
  return {
    type: REVOKE_ALL_ERROR,
    error,
  };
}

export function clearRevoked() {
  return {
    type: CLEAR_REVOKED,
  };
}

export function revokeClientAction(contactId, jobId) {
  return async dispatch => {
    try {
      dispatch(revokeClient());
      const response = await revokeClientService(contactId, jobId);
      if(response?.data?.success) dispatch(revokeClientSuccess(response?.data));
      else revokeClientError(response?.data?.error)
    } catch (error) {
      dispatch(revokeClientError(error?.response?.error));
    }
  };
}

export function revokeAllAction(jobId, contactIds) {
  return async dispatch => {
    try {
      dispatch(revokeAll());
      const response = await revokeAllService(jobId, contactIds);
      if(response?.data?.success) dispatch(revokeAllSuccess(response?.data));
      else dispatch(revokeAllError(response?.data?.error));
    } catch (error) {
      dispatch(revokeAllError(error?.response?.error));
    }
  };
}
