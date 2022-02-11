import API from './index';
import { API_KEY } from 'constants/config';

const CLIENT_JOB_DASHBOARD = API_KEY.CLIENT_JOB_DASHBOARD_KEY;
const GET_CANDIDATE_REPORT = 'candidate-detail';
const CLIENT_FEEDBACK = 'client-feedback';
const DOWNLOAD_DOCUMENT = 'candidate-document';
const ACTIVITY = 'activity'
export const getClientCandidateReportService = (invite_token, candidateId) => {
  return API.get(
    `${CLIENT_JOB_DASHBOARD}/${invite_token}/${GET_CANDIDATE_REPORT}/${candidateId}`,
  );
};

export const getClientJobDashBoardDetailService = inviteToken => {
  return API.get(`${CLIENT_JOB_DASHBOARD}/${inviteToken}`);
};

export const createClientFeedbackService = (inviteToken, data) => {
  return API.post(`${CLIENT_JOB_DASHBOARD}/${inviteToken}/${CLIENT_FEEDBACK}`, data)
}

export const updateClientFeedbackService = (inviteToken, data) => {
  return API.put(`${CLIENT_JOB_DASHBOARD}/${inviteToken}/${CLIENT_FEEDBACK}`, data)
}

export const getClientFeebackService = (inviteToken, candidateId) => {
  return API.get(`${CLIENT_JOB_DASHBOARD}/${inviteToken}/${CLIENT_FEEDBACK}/${candidateId}`);
}

export const downloadDocumentService = (inviteToken, docId) => {
  return API.get(`${CLIENT_JOB_DASHBOARD}/${inviteToken}/${DOWNLOAD_DOCUMENT}/${docId}`, {
    responseType: 'blob'
  });
}
export const getClientJobActivityPDFService = (inviteToken) => {
  return API.get(`${CLIENT_JOB_DASHBOARD}/activity/pdf/${inviteToken}`, { responseType: 'blob' });
}
