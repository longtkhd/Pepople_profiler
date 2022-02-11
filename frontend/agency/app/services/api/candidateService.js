import API from './index';
import { API_KEY } from 'constants/config';

const CANDIDATE = API_KEY.CANDIDATE_KEY;
const CANDIDATE_LIST = 'list';
const CANDIDATE_UPLOAD = 'upload-cv';
const CANDIDATE_ADD_EXISTING_CANDIDATES = 'addExistingCandidates';
const CANDIDATE_IN_JOB = 'in-job';
const ADD_TO_JOB = 'addToJob';
const CANDIDATE_ASSESSMENT = 'handleCandidateAssessment';
const GET_DOCUMENTS = 'documents';
const UPLOAD_DOCUMENT = 'upload-doc';
const REMOVE_DOCUMENT = 'remove_doc';
const DOWNLOAD_DOCUMENT = 'download_candidate_document';
const PUBLIC_DOC = 'public_doc'
const UPDATE_PUBLIC_DOCUMENT = 'update';
const INVITE_ASSESSMENT = 'inviteCandidateAssessment';
const ORIGINAL_DOCUMENT = 'original-document';
const EXPORT_REPORT_PDF = 'assessment-report/generate';
const CLIENT_EXPORT_PDF = 'assessment-report/client-contact';
const DOWNLOAD_ASSESSMENT_REPORT = 'assessment_report_file';
const RESEND_ASSESSMENT = 're-send'

const getListCandidate = (agencyId, params) => {
  return API.get(`${CANDIDATE}/${agencyId}/${CANDIDATE_LIST}`, params);
};

const addCandidateToJobService = (candidateId, params) => {
  return API.post(`${CANDIDATE}/${candidateId}/${ADD_TO_JOB}`, params);
};

const addExistingCandidates = (jobId, payload, params) => {
  return API.post(
    `${CANDIDATE}/${jobId}/${CANDIDATE_ADD_EXISTING_CANDIDATES}`,
    payload,
    params,
  );
};

const uploadCandidateCV = (jobId, payload, params) => {
  return API.post(`${CANDIDATE}/${jobId}/${CANDIDATE_UPLOAD}`, payload, params);
};

const getCandidateInfoService = (candidateId, params) => {
  return API.get(`${CANDIDATE}/${candidateId}`, params);
};
const handleCandidateAssessmentService = params => {
  return API.get(`${CANDIDATE}/${CANDIDATE_ASSESSMENT}`, { params });
};

const getShortlistedCandidate = (jobId, params) => {
  return API.get(`${CANDIDATE}/${jobId}/${CANDIDATE_IN_JOB}`, params);
};

const editCandidateInfoDetail = (candidateId, jobId, payload, params) => {
  return API.post(`${CANDIDATE}/${candidateId}/${jobId}`, payload, params);
};

const deleteCandidateInfoDetail = (candidateId, jobId) => {
  return API.delete(`${CANDIDATE}/${candidateId}/remove-from-job/${jobId}`);
};

const getDocumentsService = (candidateId, params) => {
  return API.get(`${CANDIDATE}/${candidateId}/${GET_DOCUMENTS}`, params);
};

const uploadDocumentService = (candidateId, file) => {
  return API.post(`${CANDIDATE}/${candidateId}/${UPLOAD_DOCUMENT}`, file);
};

const removeDocumentService = (candidateId, docId) => {
  return API.delete(`${CANDIDATE}/${candidateId}/${REMOVE_DOCUMENT}/${docId}`);
};

const dowloadDocumentService = (candidateId, docId) => {
  return API.get(`${CANDIDATE}/${candidateId}/${DOWNLOAD_DOCUMENT}/${docId}`, {
    responseType: 'blob',
  });
};

const updatePublicDocumentService = (candidateId, docIds) => {
  return API.post(
    `${CANDIDATE}/${PUBLIC_DOC}/${candidateId}/${UPDATE_PUBLIC_DOCUMENT}`, docIds,
  );
};

const sendInviteAssessmentService = (candidateId, data) => {
  return API.post(`${CANDIDATE}/send/${candidateId}/${INVITE_ASSESSMENT}`, data);
};

const getOriginalDocumentService = (candidateId) => {
  return API.get(`${CANDIDATE}/${candidateId}/${ORIGINAL_DOCUMENT}`);
}

const uploadOriginalDocumentService = (candidateId, data) => {
  return API.post(`${CANDIDATE}/${candidateId}/${ORIGINAL_DOCUMENT}`, data);
}

const exportReportPdf = params => {
  return API.get(`${CANDIDATE}/${EXPORT_REPORT_PDF}`, { params, responseType: 'blob' });
}

const clientExportPdfService = params => {
  return API.get(`${CANDIDATE}/${CLIENT_EXPORT_PDF}`, { params, responseType: 'blob' });
}

const dowloadAssessmentReportService = (assessmentId) => {
  return API.get(`${CANDIDATE}/${DOWNLOAD_ASSESSMENT_REPORT}/${assessmentId}`, {
    responseType: 'blob',
  });
};

const reSendAssessmentService = (assessmentId) => {
  return API.post(`${CANDIDATE}/${RESEND_ASSESSMENT}/${assessmentId}/assessment-invite`);
}

export {
  getListCandidate,
  uploadCandidateCV,
  addExistingCandidates,
  getCandidateInfoService,
  addCandidateToJobService,
  getShortlistedCandidate,
  editCandidateInfoDetail,
  handleCandidateAssessmentService,
  deleteCandidateInfoDetail,
  getDocumentsService,
  uploadDocumentService,
  removeDocumentService,
  dowloadDocumentService,
  updatePublicDocumentService,
  sendInviteAssessmentService,
  uploadOriginalDocumentService,
  getOriginalDocumentService,
  exportReportPdf,
  dowloadAssessmentReportService,
  clientExportPdfService,
  reSendAssessmentService
};
