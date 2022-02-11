/*
 *
 * candidates list reducer
 *
 */
import produce from 'immer';
import {
  SHOW_MODAL_ADD_CANDIDATE_TO_JOB,
  CLOSE_MODAL_ADD_CANDIDATE_TO_JOB,
  DELETE_EXISTING_CANDIDATE,
  INIT_ADD_EXISTING_CANDIDATE,
  ADD_EXISTING_CANDIDATE_SUCCESS,
  ADD_EXISTING_CANDIDATE_FAIL,
  CLEAN_UP_ADD_EXISTING,
  PERCENT_UPLOAD_ADD_EXISTING,
  INIT_ADD_CANDIDATE_TO_JOB_REQUEST,
  ADD_CANDIDATE_TO_JOB_SUCCESS,
  CLEAR_STATUS_ADD_CANDIDATE_TO_JOB_REQUEST,
  ADD_CANDIDATE_TO_JOB_ERROR
} from './constants';

export const initialState = {
  visibleModal: false,
  loading: false,
  statusAdd: false,
  keyAdd: 0,
  error: null
};

/* eslint-disable default-case, no-param-reassign */
const addCandidateToJobReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SHOW_MODAL_ADD_CANDIDATE_TO_JOB:
        draft.visibleModal = true;
        break;
      case CLOSE_MODAL_ADD_CANDIDATE_TO_JOB:
        draft.visibleModal = false;
        break;
      case INIT_ADD_CANDIDATE_TO_JOB_REQUEST:
        draft.loading = true;
        break;
      case ADD_CANDIDATE_TO_JOB_SUCCESS:
        draft.loading = false;
        draft.statusAdd = true;
        draft.keyAdd = draft.keyAdd + 1;

        break;
      case ADD_CANDIDATE_TO_JOB_ERROR:
        draft.loading = false;
        draft.error = action.payload;

        break;
      case CLEAR_STATUS_ADD_CANDIDATE_TO_JOB_REQUEST:
        draft.loading = false;
        draft.statusAdd = false;
        draft.keyAdd = 0;
        draft.error = null;

        break;
      // case DELETE_EXISTING_CANDIDATE:
      //   draft.candidateAdded.splice(
      //     draft.candidateAdded.findIndex(item => item.id === action.payload.id), 1);
      //   break;
      // case INIT_ADD_EXISTING_CANDIDATE:
      //   draft.loading = true;
      //   break;
      // case ADD_EXISTING_CANDIDATE_SUCCESS:
      //   draft.loading = false;
      //   draft.result = action.payload;
      //   break;
      // case ADD_EXISTING_CANDIDATE_FAIL:
      //   draft.loading = false;
      //   draft.error = action.payload;
      //   break;
      // case PERCENT_UPLOAD_ADD_EXISTING:
      //   draft.percent = action.payload;
      //   break;
      // case CLEAN_UP_ADD_EXISTING:
      //   draft.loading = false;
      //   draft.error = null;
      //   draft.result = null;
      //   draft.percent =  0;
      //   draft.candidateAdded = null;
      //   break;
    }
  });

export default addCandidateToJobReducer;
