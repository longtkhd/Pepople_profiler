/*
 *
 * EditEmailTemplate actions
 *
 */

import {
  DEFAULT_ACTION,
  EDIT_MAIL_TEMPLATE,
  EDIT_MAIL_TEMPLATE_SUCCESS,
  EDIT_MAIL_TEMPLATE_ERROR,
  GET_MAIL_TEMPLATE_BY_ID,
  GET_MAIL_TEMPLATE_BY_ID_SUCCESS,
  GET_MAIL_TEMPLATE_BY_ID_ERROR,
  RESET_STATE,

} from './constants';

import {
  editMailTemplate,
  getMailTemplatesById,
  deleteMailTemplate
} from 'services/api/mailTemplateService'

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function editMailTemplateAction() {
  return {
    type: EDIT_MAIL_TEMPLATE
  }
}

export function editMailTemplateSuccess(payload) {
  return {
    type: EDIT_MAIL_TEMPLATE_SUCCESS,
    payload
  }
}

export function editMailTemplateError(error) {
  return {
    type: EDIT_MAIL_TEMPLATE_ERROR,
    error
  }
}

export const editMailTemplateDefault = (id, data) => {
  return async dispatch => {
    try {
      dispatch(editMailTemplateAction())
      const res = await editMailTemplate(id, data);
      dispatch(editMailTemplateSuccess(res.data))
      dispatch(resetState())

    } catch (e) {
      dispatch(editMailTemplateError(e.response?.data))
      dispatch(resetState())

    }
  }
}

function getMailTemplateByIdAction() {
  return {
    type: GET_MAIL_TEMPLATE_BY_ID
  }
}

function getMailTemplateByIdSuccess(payload) {
  return {
    type: GET_MAIL_TEMPLATE_BY_ID_SUCCESS,
    payload
  }
}

function getMailTemplateByIdError(error) {
  return {
    type: GET_MAIL_TEMPLATE_BY_ID_ERROR,
    error
  }
}

export const getMailTemplateByIdDefault = (id) => {
  return async dispatch => {
    try {
      dispatch(getMailTemplateByIdAction())
      const res = await getMailTemplatesById(id);
      dispatch(getMailTemplateByIdSuccess(res.data))


    } catch (e) {
      dispatch(getMailTemplateByIdError(e.response?.data))


    }
  }
}



function resetState() {
  return {
    type: RESET_STATE
  }
}
