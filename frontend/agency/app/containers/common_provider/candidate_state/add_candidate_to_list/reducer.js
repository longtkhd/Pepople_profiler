/*
 *
 * candidates list reducer
 *
 */
import produce from 'immer';
import {
  ADD_EXISTING_CANDIDATE,
  DELETE_EXISTING_CANDIDATE,
  INIT_ADD_EXISTING_CANDIDATE,
  ADD_EXISTING_CANDIDATE_SUCCESS,
  ADD_EXISTING_CANDIDATE_FAIL,
  CLEAN_UP_ADD_EXISTING,
  PERCENT_UPLOAD_ADD_EXISTING,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
  percent: 0,
  candidateAdded: null,
};

/* eslint-disable default-case, no-param-reassign */
const listCandidateAddedReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case ADD_EXISTING_CANDIDATE:
        draft.candidateAdded = action.payload;
        break;
      case DELETE_EXISTING_CANDIDATE:
        draft.candidateAdded.splice(
          draft.candidateAdded.findIndex(item => item.id === action.payload.id), 1);
        break;
      case INIT_ADD_EXISTING_CANDIDATE:
        draft.loading = true;
        break;
      case ADD_EXISTING_CANDIDATE_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case ADD_EXISTING_CANDIDATE_FAIL:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case PERCENT_UPLOAD_ADD_EXISTING:
        draft.percent = action.payload;
        break;
      case CLEAN_UP_ADD_EXISTING:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        draft.percent =  0;
        draft.candidateAdded = null;
        break;
    }
  });

export default listCandidateAddedReducer;
