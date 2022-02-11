import API from './index';
import { API_KEY } from 'constants/config';

const CLIENT = API_KEY.CLIENT;
const CLIENT_LIST = 'list';
const CLIENT_CONTACT_DETAIL = 'client-contact-list';
const CLIENT_DELETE_CONTACT_DETAIL = 'delete-contact';
const EDIT_CLIENT_CONTACT = 'update-client-contact';
const EDIT_CLIENT = 'update-client';


const getListclient = (agencyId,params) => {
  return API.get(`${CLIENT}/${agencyId}/${CLIENT_LIST}`,params);
};

const getClientDetail = (clientId,params) => {
  return API.get(`${CLIENT}/${clientId}`,params);
};

const getClientContactDetail = (clientId,params) => {
  return API.get(`${CLIENT}/${clientId}/${CLIENT_CONTACT_DETAIL}`,params);
};

const createClient = (payload,params) => {
  return API.post(`${CLIENT}`,payload,params);
}

const deleteContactListDetail = (clientId,contactId,params) => {
  return API.delete(`${CLIENT}/${clientId}/${CLIENT_DELETE_CONTACT_DETAIL}/${contactId}`,params);
}

const editClientContact = (clientId,payload,params) => {
  return API.post(`${CLIENT}/${clientId}/${EDIT_CLIENT_CONTACT}`,payload,params);
}

const editClient = (clientId,payload,params) => {
  return API.post(`${CLIENT}/${clientId}/${EDIT_CLIENT}`,payload,params);
}

const deleteClient = (clientId,params) => {
  return API.delete(`${CLIENT}/${clientId}`,params);
}

export {
  getListclient,
  createClient,
  getClientDetail,
  getClientContactDetail,
  deleteContactListDetail,
  editClientContact,
  editClient,
  deleteClient,
};
