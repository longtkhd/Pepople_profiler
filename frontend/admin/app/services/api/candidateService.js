import API from './index';
import { API_KEY } from 'constants/config';

const CANDIDATE = API_KEY.CANDIDATE_KEY;
const CANDIDATE_LIST = 'list';
const CANDIDATE_UPLOAD = 'upload-cv';
const CANDIDATE_ADD_EXISTING_CANDIDATES = 'addExistingCandidates';

const getListCandidate = (agencyId,params) => {
  return API.get(`${CANDIDATE}/${agencyId}/${CANDIDATE_LIST}`,params);
};

const addExistingCandidates = (jobId,payload,params) => {
  return API.post(`${CANDIDATE}/${jobId}/${CANDIDATE_ADD_EXISTING_CANDIDATES}`,payload,params);
};

const uploadCandidateCV = (jobId,payload,params) => {
  return API.post(`${CANDIDATE}/${jobId}/${CANDIDATE_UPLOAD}`,payload,params);
};

export {
  getListCandidate,
  uploadCandidateCV,
  addExistingCandidates,
};
