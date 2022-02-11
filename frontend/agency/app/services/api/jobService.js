import API from './index';
import { API_KEY } from 'constants/config';

const JOB_KEY = API_KEY.JOB_KEY;
const CHANGE_STATUS_KEY = 'change-status';
const ASSIGN_RECRUITER_KEY = 're-assign-user';
const AVAILABLE_FOR_JOB = 'available-for-job';
const IN_JOB = 'in-job';

const createJob = (agencyId, payload, params) => {
  return API.post(`${JOB_KEY}/${agencyId}`, payload, params);
};

const getJobs = (agencyId, params) => {
  return API.get(`${JOB_KEY}/${agencyId}`, { params });
};

const getJobList = (agencyId, params) => {
  return API.get(`${JOB_KEY}/${agencyId}`, params);
};

const getJobListService = (agencyId, params) => {
  return API.get(`${JOB_KEY}/${agencyId}`, params);
};

const getJobDetail = (agencyId, jobId, params) => {
  return API.get(`${JOB_KEY}/${agencyId}/${jobId}`, params);
};

const editJobDetail = (jobId, params) => {
  return API.put(`${JOB_KEY}/${jobId}`, params);
};

const deleteJobDetail = (jobId, params) => {
  return API.delete(`${JOB_KEY}/${jobId}`, params);
};

const changeJobStatus = (agencyId, params) => {
  return API.post(`${JOB_KEY}/${agencyId}/${CHANGE_STATUS_KEY}`, params);
};

const assignRecruiter = params => {
  return API.post(`${JOB_KEY}/${ASSIGN_RECRUITER_KEY}`, params);
};

const changeStatusJob = (agencyId, payload, params) => {
  return API.post(`${JOB_KEY}/${agencyId}/${CHANGE_STATUS_KEY}`, payload, params);
};

const getContactListForJob = (agencyId, jobId, params) => {
  return API.get(
    `${JOB_KEY}/${agencyId}/${AVAILABLE_FOR_JOB}/${jobId}`,
    params,
  );
};

const getContactListInJob = (agencyId, jobId, params) => {
  return API.get(`${JOB_KEY}/${agencyId}/${IN_JOB}/${jobId}`, params);
};

const deleteContactInJob = (jobId, contactId, params) => {
  return API.delete(`${JOB_KEY}/${jobId}/delete/${contactId}`, params);
};

const activityRecuitment = (jobId, payload, params) => {
  return API.put(`${JOB_KEY}/${jobId}/recruiter-activity`, payload, params);
}

const createDateInterview = (token, jobId, payload, params) => {
  return API.post(`${JOB_KEY}/${jobId}/createDateInterview/${token}`, payload, params);
}

const getDateInterviewOfCandidate = (jobId, candidate_id, params) => {
  return API.get(`${JOB_KEY}/activity/gettime/${jobId}`, params);
}

const deleteInterviewOfCandidate = (timeId, params) => {
  return API.delete(`${JOB_KEY}/activity/delete-time/${timeId}`, params);
}
const deleteInterviewOfCandidates = (params) => {
  return API.post(`${JOB_KEY}/activity/delete-time`, params);
}

const getTimeOfJob = (jobId, client_contact_id, params) => {
  return API.get(`${JOB_KEY}/getTimeofJob/${jobId}/${client_contact_id}`, params);
}
const getJobActivityPDFService = (job_id) => {
  return API.get(`${JOB_KEY}/activity/pdf/${job_id}`, { responseType: 'blob' });
}
export {
  createJob,
  getJobs,
  getJobList,
  getJobListService,
  getJobDetail,
  editJobDetail,
  deleteJobDetail,
  changeJobStatus,
  assignRecruiter,
  changeStatusJob,
  getContactListForJob,
  getContactListInJob,
  deleteContactInJob,
  activityRecuitment,
  createDateInterview,
  getDateInterviewOfCandidate,
  deleteInterviewOfCandidate,
  deleteInterviewOfCandidates,
  getTimeOfJob,
  getJobActivityPDFService
};
