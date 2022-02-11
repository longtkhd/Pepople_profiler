/*
 *
 * CandidateReportPreview reducer
 *
 */
import produce from 'immer';
import {
  GET_CANDIDATE_INFO,
  GET_CANDIDATE_INFO_ERROR,
  GET_CANDIDATE_INFO_SUCCESS,
} from './constants';

export const initialState = {
  candidateLoading: false,
  candidateInfo: null,
  candidateError: null,
};

/* eslint-disable default-case, no-param-reassign */
const candidateReportPreviewReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_CANDIDATE_INFO:
        draft.candidateLoading = true;
        draft.candidateInfo = null;
        draft.candidateError = null;
        break;
      case GET_CANDIDATE_INFO_SUCCESS:
        draft.candidateLoading = false;
        draft.candidateInfo = action.payload.data;
        draft.candidateError = null;
        break;
      case GET_CANDIDATE_INFO_ERROR:
        draft.candidateLoading = false;
        draft.candidateInfo = null;
        draft.candidateError = action.error;
        break;
      default:
        break;
    }
  });

export default candidateReportPreviewReducer;
