/*
 *
 * upload candidates actions
 *
 */

import {
  CANDIDATE_UPLOAD_INIT,
  CANDIDATE_UPLOAD_SUCCESS,
  CANDIDATE_UPLOAD_FAIL,
  CANDIDATE_CLEAN_UP,
  PREVIEW_LIST_CANDIDATE,
  PREVIEW_LIST_CANDIDATE_EXISTS,
  DELETE_CANDIDATE_PREVIEW,
  DELETE_CANDIDATE_PREVIEW_EXISTS,
  PERCENT_UPLOAD_CANDIDATE_CV,
  CLEAN_CANDIDATE_UPLOAD_CV,
  CLEAR_CANCEL_UPLOAD,
} from './constants';

import * as candidateService from 'services/api/candidateService';

export const uploadCV = (jobId, payload, param) => async dispatch => {
  try {
    dispatch(uploadInit());
    const res = await candidateService.uploadCandidateCV(jobId, payload, param);
    dispatch(uploadCandidateSuccess(res.data));
  } catch (error) {
    dispatch(uploadCandidateError(error));
  }
};

export const uploadInit = () => ({
  type: CANDIDATE_UPLOAD_INIT,
});

export const uploadCandidateSuccess = payload => ({
  type: CANDIDATE_UPLOAD_SUCCESS,
  payload,
});

export const uploadCandidateError = payload => ({
  type: CANDIDATE_UPLOAD_FAIL,
  payload,
});

export const cleanUploadCandidate = () => ({
  type: CANDIDATE_CLEAN_UP,
});

export const previewListCandidate = payload => ({
  type: PREVIEW_LIST_CANDIDATE,
  payload,
});

export const previewListCandidateExists = payload => ({
  type: PREVIEW_LIST_CANDIDATE_EXISTS,
  payload,
});

export const deleteCandidatePreview = id => ({
  type: DELETE_CANDIDATE_PREVIEW,
  payload: { id },
});

export const deleteCandidateExistsPreview = id => ({
  type: DELETE_CANDIDATE_PREVIEW_EXISTS,
  payload: { id },
});

export const percentUploadCandidate = payload => ({
  type: PERCENT_UPLOAD_CANDIDATE_CV,
  payload,
});

export const cleanUploadCVCandidate = (payload) => {
  return ({
    type: CLEAN_CANDIDATE_UPLOAD_CV,
  })
};

export const clearCancelUpload = () => ({
  type: CLEAR_CANCEL_UPLOAD,
})
