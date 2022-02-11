import API from './index';
import { API_KEY } from 'constants/config';

const RECRUITER_KEY = API_KEY.RECRUITER_KEY;
const GET_RECRUITER_LIST = 'recruiter_list'

export const deleteRecruiter = (recruiterId) => {
  return API.delete(`${RECRUITER_KEY}/${recruiterId}`);
}

export const updateRecruiter = (recruiterId, jwtToken, data) => {
  return API.post(`${RECRUITER_KEY}/${recruiterId}/edit`, data, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });
}


export const getRecruiterDetails = (recruiterId, params) => {
  return API.get(`${RECRUITER_KEY}/${recruiterId}/info`, params);
}

export const getRecruiterListByAdmin = (params) => {
  return API.get(`${RECRUITER_KEY}/${GET_RECRUITER_LIST}`, params)
}

