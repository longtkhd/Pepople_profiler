import API from './index';
import { API_KEY } from 'constants/config';

const JOB_KEY = API_KEY.JOB_KEY;
const CHANGE_STATUS_KEY = 'change-status';
const ASSIGN_RECRUITER_KEY = 're-assign-user';

const createJob = (agencyId,payload,params) => {
  return API.post(`${JOB_KEY}/${agencyId}`,payload,params);
};

const getJobs = (agencyId, params) => {
  return API.get(`${JOB_KEY}/${agencyId}`, { params });
};

const getJobList = (agencyId, params) => {
  return API.get(`${JOB_KEY}/${agencyId}`,params);
};

const getJobDetail = (agencyId,jobId, params) => {
  return API.get(`${JOB_KEY}/${agencyId}/${jobId}`,params);
};

const editJobDetail = (jobId, params) => {
  return API.put(`${JOB_KEY}/${jobId}`,params);
};

const deleteJobDetail = (jobId, params) => {
  return API.delete(`${JOB_KEY}/${jobId}`,params);
};

const changeJobStatus = (agencyId, params) => {
  return API.post(`${JOB_KEY}/${agencyId}/${CHANGE_STATUS_KEY}`, params);
};

const assignRecruiter = (params) => {
  return API.post(`${JOB_KEY}/${ASSIGN_RECRUITER_KEY}`, params);
};

export {
  createJob,
  getJobs,
  getJobList,
  getJobDetail,
  editJobDetail,
  deleteJobDetail,
  changeJobStatus,
  assignRecruiter,
};
