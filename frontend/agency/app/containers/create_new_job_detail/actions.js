/*
 *
 * CreateNewJobDetail actions
 *
 */

import {
  STEP_CREATE_JOB,
  ADD_EXISTING_CANDIDATE,
  DELETE_EXISTING_CANDIDATE,
  FETCH_EXISTING_CANDIDATE,
  ERROR_EXISTING_CANDIDATE,
  RECEIVE_EXISTING_CANDIDATE,
  CLEAN_STEP_CREATE_JOB,
  PREVIEW_UPLOAD_CANDIDATE,
  DELETE_CANDIDATE_PREVIEW,
} from './constants';

// ========= step create ============
export const stepCreateJob = (step) => ({
  type: STEP_CREATE_JOB,
  payload: step + 1
});

export const cleanStepCreateJob = () => ({
  type: CLEAN_STEP_CREATE_JOB,
});

// ========== Candidate ============

export const fetchExistCandidate = () => ({
  type: FETCH_EXISTING_CANDIDATE,
});

export const receiveExistCandidate = (payload) => ({
  type: RECEIVE_EXISTING_CANDIDATE,
  payload
});

export const errorExistCandidate = (error) => ({
  type: ERROR_EXISTING_CANDIDATE,
  payload: { error }
})

export const addExistCandidate = (payload) => ({
  type: ADD_EXISTING_CANDIDATE,
  payload
});

export const deleteExistCandidate = (id) => ({
  type: DELETE_EXISTING_CANDIDATE,
  payload: { id }
});

export const previewCandidateUpload = payload => ({
  type: PREVIEW_UPLOAD_CANDIDATE,
  payload,
});

export const deletePreviewCandidate = id => ({
  type: DELETE_CANDIDATE_PREVIEW,
  payload: { id }
})
