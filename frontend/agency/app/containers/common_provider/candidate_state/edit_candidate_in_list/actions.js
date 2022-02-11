/*
 *
 * edit candidates in job actions
 *
 */

import {
  INIT_EDIT_CANDIDATE,
  EDIT_CANDIDATE_SUCCESS,
  EDIT_CANDIDATE_FAIL,
  CLEAN_UP_EDIT_CANDIDATE,
  SAVE_REPORT_FORM
} from './constants';
import * as candidateService from 'services/api/candidateService';

export const editCandidateInfoDetail = (candidateId, jobId, payload, param) => async dispatch => {
  try {
    dispatch(initEditCandidate());
    const res = await candidateService.editCandidateInfoDetail(candidateId, jobId, payload, param);
    dispatch(editCandidateSuccess(res.data));
  } catch (error) {
    dispatch(editCandidateError(error));
  }
};

export const editCandidateInfoDetailDone = (candidateId, jobId, payload, param ) => async dispatch => {
  try {
    dispatch(initEditCandidate());
    const res = await candidateService.editCandidateInfoDetail(candidateId, jobId, payload, param);
    dispatch(editCandidateSuccess({ ...res.data, done: true }));
  } catch (error) {
    dispatch(editCandidateError(error));
  }
};

export const autoSaveCandidateInfoDetail = (candidateId, jobId, payload, param ) => async dispatch => {
  try {
    await candidateService.editCandidateInfoDetail(candidateId, jobId, payload, param);
  } catch (error) {
    dispatch(editCandidateError(error));
  }
};

export const doSaveCandidateReportForm = (payload) => async dispatch => {
  dispatch(saveCandidateReportForm(payload));
};

export const initEditCandidate = () => ({
  type: INIT_EDIT_CANDIDATE,
});

export const editCandidateSuccess = (payload) => ({
  type: EDIT_CANDIDATE_SUCCESS,
  payload,
});

export const editCandidateError = (payload) => ({
  type: EDIT_CANDIDATE_FAIL,
  payload,
});

export const cleanUpEditCandidate = () => ({
  type: CLEAN_UP_EDIT_CANDIDATE,
});

export const saveCandidateReportForm = (payload) => ({
  type: SAVE_REPORT_FORM,
  payload,
});