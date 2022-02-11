/*
 *
 * InviteClientEmail actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_MAIL_TEMPLATE_USER,
  GET_MAIL_TEMPLATE_USER_SUCCESS,
  GET_MAIL_TEMPLATE_USER_ERROR,
  GET_MAIL_TEMPLATE_USER_BY_ID,
  GET_MAIL_TEMPLATE_USER_BY_ID_SUCCESS,
  GET_MAIL_TEMPLATE_USER_BY_ID_ERROR,
  SAVE_MAIL_TEMPLATE,
  SAVE_MAIL_TEMPLATE_SUCCESS,
  SAVE_MAIL_TEMPLATE_ERROR,
  RESET_STATE
} from './constants';

import {
  getMailTemplateForUser,
  getMailTemplateForUserById,
  saveMailTemplateForUser
} from 'services/api/mailTemplateService'

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const getMailTemplateUserDefault = (params) => {

  return async dispatch => {
    try {
      dispatch(getMailTemplateUserAction());
      const res = await getMailTemplateForUser(params);
      dispatch(getMailTemplateSuccess(res.data))
      // dispatch(getMailTemplateSuccess(res.data))
    } catch (e) {
      dispatch(getMailTemplateError(e.response?.data))
    }
  }
}

function getMailTemplateUserAction() {
 

  return {
    type: GET_MAIL_TEMPLATE_USER
  }
}

function getMailTemplateSuccess(payload) {

  return {
    type: GET_MAIL_TEMPLATE_USER_SUCCESS,
    payload
  }
}

function getMailTemplateError(error) {
  return {
    type: GET_MAIL_TEMPLATE_USER_ERROR,
    error
  }
}

function getMailTemplateInfoAction() {
  return {
    type: GET_MAIL_TEMPLATE_USER_BY_ID
  }
}

function getMailTemplateInfoSuccess(payload) {
  return {
    type: GET_MAIL_TEMPLATE_USER_BY_ID_SUCCESS,
    payload
  }
}

function getMailTemplateInfoError(error) {
  return {
    type: GET_MAIL_TEMPLATE_USER_BY_ID_ERROR,
    error
  }
}

export const getMailTemplateDefault = (id) => {
  return async dispatch => {
    try {
      dispatch(getMailTemplateInfoAction());
      const res = await getMailTemplateForUserById(id);
      dispatch(getMailTemplateInfoSuccess(res.data));
    } catch (e) {
      dispatch(getMailTemplateInfoError(e.response?.data));
    }
  }
}

function addMailTemplateAction() {
  return {
    type: SAVE_MAIL_TEMPLATE
  }
}

function addMailTemplateSuccess(payload) {
  return {
    type: SAVE_MAIL_TEMPLATE_SUCCESS,
    payload
  }
}

function addMailTemplateError(error) {
  return {
    type: SAVE_MAIL_TEMPLATE_ERROR,
    error
  }
}

function resetState() {
  return {
    type: RESET_STATE
  }
}

export const addMailTemplateDefault = (data) => {
  return async dispatch => {
    try {
      dispatch(addMailTemplateAction());
      const res = await saveMailTemplateForUser(data);
     
      dispatch(addMailTemplateSuccess(res.data));
      dispatch(resetState())
    } catch(e){
      dispatch(addMailTemplateError(e.response?.data))
      dispatch(resetState())
    }
  }
}



