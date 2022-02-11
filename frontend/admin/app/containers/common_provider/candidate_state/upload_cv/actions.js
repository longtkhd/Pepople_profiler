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
} from './constants';
import * as candidateService from 'services/api/candidateService';

export const uploadCV = (jobId,payload,param) => async dispatch => {
  try {
    dispatch(uploadInit());
    const res = await candidateService.uploadCandidateCV(jobId,payload,param);
    dispatch(uploadCandidateSuccess(res.data));
  } catch (error) {
    dispatch(uploadCandidateError(error));
  }
}

export const uploadInit = () => ({
  type: CANDIDATE_UPLOAD_INIT
});

export const uploadCandidateSuccess = payload => ({
  type: CANDIDATE_UPLOAD_SUCCESS,
  payload
});

export const uploadCandidateError = payload => ({
  type: CANDIDATE_UPLOAD_FAIL,
  payload
});

export const cleanUploadCandidate = () => ({
  type: CANDIDATE_CLEAN_UP,
})
