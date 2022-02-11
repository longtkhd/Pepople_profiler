import API from './index';
import { API_KEY } from 'constants/config';

const USER_KEY = API_KEY.USER_KEY;
const INVITE_RECRUITER = 'invite_recruiter';
const IMPORT_RECRUITER = 'import_recruiter';
const CHARGES_INVITE_RECRUITER = 'charges_invite_recruiter'
const DEACTIVE_ACCOUNT = 'deactivateAccount';
const UPDATE_PROFILE = 'updateProfile';
const GET_NOTIFICATION_SETTING = 'get_notification_setting';
const CHANGE_NOTIFICATION_SETTING = 'change_notification_setting';
const GET_NOTIFICATION = 'user_notification_list';

const inviteRecruiter = (agencyId, data,params) => {
  return API.post(`${USER_KEY}/${agencyId}/${INVITE_RECRUITER}`, data, params);
};

const inviteCSVRecruiter = (agencyId, data, params) => {
  return API.post(`${USER_KEY}/${agencyId}/${IMPORT_RECRUITER}`, data, params);
};

const deactivateAccount = (data, params) => {
  return API.post(`${USER_KEY}/${DEACTIVE_ACCOUNT}`, data, params);
};

const updateProfile = (data, params) => {
  return API.post(`${USER_KEY}/${UPDATE_PROFILE}`, data, params);
}

const getNotificationSettings = () => {
  return API.get(`${USER_KEY}/${GET_NOTIFICATION_SETTING}`);
}

const updateNotificationSettings = (params) => {
  return API.post(`${USER_KEY}/${CHANGE_NOTIFICATION_SETTING}`, params);
}

const updateNotificationSettingsSetup = (accessToken, params) => {
  return API.post(`${USER_KEY}/${CHANGE_NOTIFICATION_SETTING}`, params, { headers: { authorization: `Bearer ${accessToken}` } });
}

const chargesInviteRecruiterService = (agencyId, params) => {
  return API.post(`${USER_KEY}/${agencyId}/${CHARGES_INVITE_RECRUITER}`, params);
}

export {
  inviteRecruiter,
  inviteCSVRecruiter,
  deactivateAccount,
  updateProfile,
  getNotificationSettings,
  updateNotificationSettings,
  updateNotificationSettingsSetup,
  chargesInviteRecruiterService,
};
