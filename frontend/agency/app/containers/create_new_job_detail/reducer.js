/*
 *
 * CreateNewJobDetail reducer
 *
 */
import produce from 'immer';
import {
  STEP_CREATE_JOB,
  ADD_EXISTING_CANDIDATE,
  DELETE_EXISTING_CANDIDATE,
  FETCH_EXISTING_CANDIDATE,
  RECEIVE_EXISTING_CANDIDATE,
  ERROR_EXISTING_CANDIDATE,
  CLEAN_STEP_CREATE_JOB,
  PREVIEW_UPLOAD_CANDIDATE,
  DELETE_CANDIDATE_PREVIEW,
} from './constants';

export const initialState = {
  loading: false,
  errors: null,
  step: 1,
  candidates: null,
  candidateAdded: null,
  candidateUploadCV: null,
};

/* eslint-disable default-case, no-param-reassign */
const createNewJobDetailReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case FETCH_EXISTING_CANDIDATE:
        draft.loading = true;
        break;
      case RECEIVE_EXISTING_CANDIDATE:
        draft.loading = false;
        draft.candidates = action.payload;
      case ERROR_EXISTING_CANDIDATE:
        draft.loading = false;
        draft.errors = action.payload.error;
        break;
      case STEP_CREATE_JOB:
        draft.step =
          action.payload > 3 || action.payload <= 0 ? 1 : action.payload;
        break;
      case ADD_EXISTING_CANDIDATE:
        draft.candidateAdded = action.payload;
        break;
      case DELETE_EXISTING_CANDIDATE:
        draft.candidateAdded.splice(
          draft.candidateAdded.findIndex(item => item.id === action.payload.id),
          1,
        );
        break;
      case PREVIEW_UPLOAD_CANDIDATE:
        draft.candidateUploadCV = action.payload;
        break;
      case DELETE_CANDIDATE_PREVIEW:
        draft.candidateUploadCV.splice(
          draft.candidateUploadCV.findIndex(
            item => item.uid === action.payload.id,
          ),
          1,
        );
        break;
        break;
      case CLEAN_STEP_CREATE_JOB:
        draft.step = 1;
        draft.candidateAdded = null;
        draft.candidateUploadCV = null;
        break;
    }
  });

export default createNewJobDetailReducer;
