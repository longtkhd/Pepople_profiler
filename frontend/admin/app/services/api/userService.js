import API from './index';
import { API_KEY } from 'constants/config';

const USER_KEY = API_KEY.USER_KEY;
const INVITE_RECRUITER = 'invite_recruiter';
const IMPORT_RECRUITER = 'import_recruiter';
const DEACTIVE_ACCOUNT = 'deactivateAccount';
const UPDATE_PROFILE = 'updateProfile';

const inviteRecruiter = (agencyId, data) => {
  return API.post(`${USER_KEY}/${agencyId}/${INVITE_RECRUITER}`, data);
};

const inviteCSVRecruiter = (agencyId, data) => {
  return API.post(`${USER_KEY}/${agencyId}/${IMPORT_RECRUITER}`, data);
};

const deactivateAccount = (data) => {
  return API.post(`${USER_KEY}/${DEACTIVE_ACCOUNT}`, data);
};

const updateProfile = (data) => {
  return API.post(`${USER_KEY}/${UPDATE_PROFILE}`, data)
}


export {
  inviteRecruiter,
  inviteCSVRecruiter,
  deactivateAccount,
  updateProfile
};
