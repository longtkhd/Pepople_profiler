import API from './index';
import { API_KEY } from 'constants/config';

const RECRUITER_KEY = API_KEY.RECRUITER_KEY;
const RESEND_VERIFY_KEY = API_KEY.RESEND_VERIFY_KEY;
const REQUEST_CHANGE_EMAIL = 'requestChangeEmail';
const DEACTIVE = 'deactive';

export const deleteRecruiter = (recruiterId) => {
  return API.delete(`${RECRUITER_KEY}/${recruiterId}`);
}

export const deactiveRecruiter = (recruiterId) => {
  return API.post(`${RECRUITER_KEY}/${recruiterId}/${DEACTIVE}`);
}

export const updateRecruiter = (recruiterId, data) => {
  return API.post(`${RECRUITER_KEY}/${recruiterId}/edit`, data);
}

export const getRecruiterDetails = (recruiterId,params) => {
  return API.get(`${RECRUITER_KEY}/${recruiterId}/info`,params);
}

export const requestChangeEmailRecruiter = (recruiterId, data) => {
  return API.post(`${RECRUITER_KEY}/${recruiterId}/${REQUEST_CHANGE_EMAIL}`, data)
}

export const reInviteRecruiterService = (recruiterId) => {
  return API.post(`${RECRUITER_KEY}/${recruiterId}/${RESEND_VERIFY_KEY}`)
}


