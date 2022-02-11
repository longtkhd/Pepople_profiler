import API from './index';
import { API_KEY } from 'constants/config';

const MAIL_TEMPLATE_KEY = API_KEY.MAIL_TEMPLATE_KEY;

const GET_MAIL_TEMPLATE = 'getMailTemplatesForUser'
const EDIT_MAIL_TEMPLATE = 'editMailTemplatesForUser'
const DELETE_MAIL_TEMPLATE = 'deleteMailTemplatesForUser'
const MAIL_TEMPLATE_FOR_USER = 'getMailTemplatesForUser'
const ADD_MAIL_TEMPLATE = 'addMailTemplatesForUser'


export const getMailTemplates = () => {
    return API.get(`${MAIL_TEMPLATE_KEY}/${GET_MAIL_TEMPLATE}`)
}

export const getMailTemplatesById = (id) => {
    return API.get(`${MAIL_TEMPLATE_KEY}/${GET_MAIL_TEMPLATE}/${id}`)
}

export const editMailTemplate = (id, data) => {
    return API.post(`${MAIL_TEMPLATE_KEY}/${EDIT_MAIL_TEMPLATE}/${id}`, data)
}

export const deleteMailTemplate = (id) => {
    return API.delete(`${MAIL_TEMPLATE_KEY}/${DELETE_MAIL_TEMPLATE}/${id}`)
}

export const getMailTemplateForUser = (params) => {
    return API.get(`${MAIL_TEMPLATE_KEY}/${MAIL_TEMPLATE_FOR_USER}`, params)
}

export const getMailTemplateForUserById = (id) => {
    return API.get(`${MAIL_TEMPLATE_KEY}/${MAIL_TEMPLATE_FOR_USER}/${id}`)
}

export const saveMailTemplateForUser = (data) => {
    return API.post(`${MAIL_TEMPLATE_KEY}/${ADD_MAIL_TEMPLATE}`,data)
}