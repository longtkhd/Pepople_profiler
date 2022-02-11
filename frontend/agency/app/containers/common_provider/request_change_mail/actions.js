/*
 *
 * RequestChangeMail actions
 *
 */

import {
  DEFAULT_ACTION,
  REQUEST_CHANGE_MAIL,
  REQUEST_CHANGE_MAIL_SUCCESS,
  REQUEST_CHANGE_MAIL_ERROR,
  RESET_STATE
} from './constants';
import { requestChangeEmailRecruiter } from 'services/api/recruiterService'
export default (id, data) => {
  return async dispatch => {
    try {
      dispatch(changeMailAction());
      const res = await requestChangeEmailRecruiter(id, data);
      dispatch(changeMailSuccess(res.data))
      dispatch(resetState())
    } catch (e) {
      dispatch(changeMailError(e.response?.data))
      dispatch(resetState())

    }
  }
}

function changeMailAction() {
  return {
    type: REQUEST_CHANGE_MAIL
  }
}

function changeMailSuccess(payload) {
  return {
    type: REQUEST_CHANGE_MAIL_SUCCESS,
    payload
  }
}

function changeMailError(error) {
  return {
    type: REQUEST_CHANGE_MAIL_ERROR,
    error
  }
}

function resetState() {
  return {
    type: RESET_STATE
  }
}
