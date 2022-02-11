
import {
  CLEAR_CLIENT_FEEDBACK,
  GET_CLIENT_FEEDBACK,
  GET_CLIENT_FEEDBACK_ERROR,
  GET_CLIENT_FEEDBACK_SUCCESS,
} from './constants';

import { getClientFeedbackService } from 'services/api/clientService';

function getClientFeedback() {
  return {
    type: GET_CLIENT_FEEDBACK,
  };
}

function getClientFeedbackSuccess(payload) {
  return {
    type: GET_CLIENT_FEEDBACK_SUCCESS,
    payload,
  };
}

function getClientFeedbackError(error) {
  return {
    type: GET_CLIENT_FEEDBACK_ERROR,
    error,
  };
}

export function clearClientFeedbackAction() {
  return {
    type: CLEAR_CLIENT_FEEDBACK,
  };
}

export function getClientFeedbackAction(jobId, clientContactId) {
  return async dispatch => {
    try {
        dispatch(getClientFeedback());
        const response = await getClientFeedbackService(jobId, clientContactId);
        dispatch(getClientFeedbackSuccess(response?.data));
    } catch (error) {
        dispatch(getClientFeedbackError(error?.response?.data));
    }
  };
}
