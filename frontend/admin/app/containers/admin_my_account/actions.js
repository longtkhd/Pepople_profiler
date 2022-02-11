/*
 *
 * AdminMyAccount actions
 *
 */

import {
  DEFAULT_ACTION,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR
} from './constants';
import { changePassword } from 'services/api/authService';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export default data => {
  return async dispatch => { 
    try {
           console.log(data)
            dispatch(changePasswordAction());
          const response = await changePassword(data);
            dispatch(changePasswordSuccess(response.data))
            dispatch(resetState())
       
    } catch (err) {
      console.log(err)
            dispatch(changePasswordError(err.response?.data));
        }
    }
}

function changePasswordAction(payload) {

    return {
        type: CHANGE_PASSWORD,
        payload
    };
}

function changePasswordSuccess(payload) {
    return {
        type: CHANGE_PASSWORD_SUCCESS,
        payload
    };
}

function changePasswordError(error) {
    return {
        type: CHANGE_PASSWORD_ERROR,
        error
    };
}

export function resetState(payload) {
    return {
        type: RESET_STATE,
        payload
    };
}

