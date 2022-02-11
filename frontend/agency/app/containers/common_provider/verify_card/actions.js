/*
 *
 * Verify card actions
 *
 */

import { 
  VERIFY_CARD,
  VERIFY_CARD_SUCCESS,
  VERIFY_CARD_ERROR,
  UPDATE_CARD,
  UPDATE_CARD_SUCCESS,
  UPDATE_CARD_ERROR,
  CLEAR_UPDATE_CARD
} from './constants';
import { verifyCard, updatePaymentMethod } from 'services/api/agencyService';

export default (agencyId, data) => {
  return async dispatch => {
    try {
      dispatch(verifyCardAction(data));
      const response = await verifyCard(agencyId, data);
      if(response && response.data?.success){
        dispatch(verifyCardSuccess(response.data));
      }else{
        dispatch(verifyCardError(response?.data?.error || response?.message));
      }
    } catch (err) {
      dispatch(verifyCardError(err.response?.data));
    }
  }
}

export function updatePaymentMethodAction(agencyId, data) {
  return async dispatch => {
    try {
      dispatch(updateCardAction());
      const response = await updatePaymentMethod(agencyId, data);
      if(response && response.data?.success){
        dispatch(updateCardSuccess(response.data));
      }else{
        dispatch(updateCardError(response?.data?.error || response?.message));
      }
    } catch (error) {
      dispatch(updateCardError(error.response?.data));
    }
  }
}

export function clearUpdateCardAction (){
  return {
    type: CLEAR_UPDATE_CARD
  }
}

function verifyCardAction(payload) {
  return {
    type: VERIFY_CARD,
    payload
  };
}

function verifyCardSuccess(payload) {
  return {
    type: VERIFY_CARD_SUCCESS,
    payload
  };
}

function verifyCardError(error) {
  return {
    type: VERIFY_CARD_ERROR,
    error
  };
}

function updateCardAction(payload) {
  return {
    type: UPDATE_CARD,
    payload
  };
}

function updateCardSuccess(payload) {
  return {
    type: UPDATE_CARD_SUCCESS,
    payload
  };
}

function updateCardError(error) {
  return {
    type: UPDATE_CARD_ERROR,
    error
  };
}