/*
 *
 * Verify card actions
 *
 */

import {
  VERIFY_CARD,
  VERIFY_CARD_SUCCESS,
  VERIFY_CARD_ERROR,
} from './constants';
import { verifyCardSetup } from 'services/api/agencyService';

export default (accessToken, agencyId, data) => {
  return async dispatch => {
    try {
      dispatch(verifyCard());
      const response = await verifyCardSetup(accessToken, agencyId, data);
      if (response?.data?.success) {
        dispatch(verifyCardSuccess(response.data));
      } else {
        dispatch(verifyCardError(response?.data?.error || response?.message));
      }
    } catch (err) {
      dispatch(verifyCardError(err.response?.data));
    }
  }
}

function verifyCard() {
  return {
    type: VERIFY_CARD,
  };
}

function verifyCardSuccess(response) {
  return {
    type: VERIFY_CARD_SUCCESS,
    response
  };
}

function verifyCardError(error) {
  return {
    type: VERIFY_CARD_ERROR,
    error
  };
}