/*
 *
 * RecruiterEmailSettings actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_MAIL_TEMPLATE,
  GET_MAIL_TEMPLATE_SUCCESS,
  GET_MAIL_TEMPLATE_ERROR,
  DELETE_MAIL_TEMPLATE,
  DELETE_MAIL_TEMPLATE_SUCCESS,
  DELETE_MAIL_TEMPLATE_ERROR,
  RESET_STATE
} from './constants';

import {
  getMailTemplates,
  deleteMailTemplate
} from 'services/api/mailTemplateService'


export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

function getMailTemplateAction() {
  return {
    type: GET_MAIL_TEMPLATE
  }
}

function getMailTemplateSuccess(payload) {
  return {
    type: GET_MAIL_TEMPLATE_SUCCESS,
    payload

  }
}

function getMailTemplateError(error) {
  return {
    type: GET_MAIL_TEMPLATE_ERROR,
    error
  }
}

export default () => {
  return async dispatch => {
    try {
      dispatch(getMailTemplateAction());
      const res = await getMailTemplates()
      dispatch(getMailTemplateSuccess(res.data))

    } catch (e) {
      dispatch(getMailTemplateError(e.response?.data))

    }
  }
}

function deleteMailTemplateAction() {
  return {
    type: DELETE_MAIL_TEMPLATE
  }
}

function deleteMailTemplateSuccess(payload) {
  return {
    type: DELETE_MAIL_TEMPLATE_SUCCESS,
    payload

  }
}

function deleteMailTemplateError(error) {
  return {
    type: DELETE_MAIL_TEMPLATE_ERROR,
    error
  }
}

export const deleteMailTemplateDefault = (id) => {
  return async dispatch => {
    try {
      dispatch(deleteMailTemplateAction());
      const res = await deleteMailTemplate(id);
      dispatch(deleteMailTemplateSuccess(res.data))
      dispatch(resetState())
    } catch (e) {
      dispatch(deleteMailTemplateError(e.response?.data))

    }
  }
}



function resetState() {
  return {
    type: RESET_STATE
  }
}
