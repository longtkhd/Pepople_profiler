import API from './index';
import { API_KEY } from 'constants/config';

const CLIENT = API_KEY.CLIENT;
const CLIENT_LIST = 'list';
const CLIENT_CONTACT_DETAIL = 'client-contact-list';
const CLIENT_DELETE_CONTACT_DETAIL = 'delete-contact';
const EDIT_CLIENT_CONTACT = 'update-client-contact';
const EDIT_CLIENT = 'update-client';
const ADD_TO_JOB = 'add-to-job';
const INVITE_TO = 'invite_to';
const GET_CLIENT_FEEDBACK = 'client-feedback';
const REVOKE = 'revoke-from';
const ADD_CONTACT = 'add-contact';

const getListclient = (agencyId, params) => {
  return API.get(`${CLIENT}/${agencyId}/${CLIENT_LIST}`, params);
};

const getClientDetail = (clientId, params) => {
  return API.get(`${CLIENT}/${clientId}`, params);
};

const getClientContactDetail = (clientId, params) => {
  return API.get(`${CLIENT}/${clientId}/${CLIENT_CONTACT_DETAIL}`, params);
};

const createClient = (payload, params) => {
  return API.post(`${CLIENT}`, payload, params);
};

const deleteContactListDetail = (clientId, contactId, params) => {
  return API.delete(
    `${CLIENT}/${clientId}/${CLIENT_DELETE_CONTACT_DETAIL}/${contactId}`,
    params,
  );
};

const editClientContact = (clientId, payload, params) => {
  return API.post(
    `${CLIENT}/${clientId}/${EDIT_CLIENT_CONTACT}`,
    payload,
    params,
  );
};

const editClient = (clientId, payload, params) => {
  return API.post(`${CLIENT}/${clientId}/${EDIT_CLIENT}`, payload, params);
};

const deleteClient = (clientId, params) => {
  return API.delete(`${CLIENT}/${clientId}`, params);
};

const addContactToCurrentJob = (contactId, jobId, params) => {
  return API.post(`${CLIENT}/${contactId}/${ADD_TO_JOB}/${jobId}`, params);
};

const inviteContactOnJob = (contactId, jobId, params) => {
  return API.post(`${CLIENT}/${contactId}/${INVITE_TO}/${jobId}`, params);
};



const addMoreContactJob = (jobId, payload, params) => {
  return API.post(`${CLIENT}/${ADD_TO_JOB}/${jobId}`, payload, params);
};

const getClientFeedbackService = (jobId, clientContactId) => {
  return API.get(
    `${CLIENT}/${jobId}/${GET_CLIENT_FEEDBACK}/${clientContactId}`,
  );
};

const revokeClientService = (contactId, jobId) => {
  return API.post(`${CLIENT}/${contactId}/${REVOKE}/${jobId}`);
};

const revokeAllService = (jobId, contactIds) => {
  return API.post(`${CLIENT}/${REVOKE}/${jobId}`, contactIds);
};

const inviteAllService = (jobId, params) => {
  return API.post(`${CLIENT}/${INVITE_TO}/${jobId}`, params);
};

const clientCreateContact = (clientId, payload, params) => {
  return API.post(`${CLIENT}/${clientId}/${ADD_CONTACT}`, payload, params);
};

const addTimeInterview = (jobId, contactId, payload, params) => {
  return API.post(`${CLIENT}/${jobId}/${contactId}/addTimeInterview`, payload, params);
};

export {
  getListclient,
  createClient,
  getClientDetail,
  getClientContactDetail,
  deleteContactListDetail,
  editClientContact,
  editClient,
  deleteClient,
  addContactToCurrentJob,
  inviteContactOnJob,
  addMoreContactJob,
  getClientFeedbackService,
  revokeClientService,
  revokeAllService,
  inviteAllService,
  clientCreateContact,
  addTimeInterview
};
