/*
 *
 * candidates list reducer
 *
 */
import produce from 'immer';
import {
    ADD_CANDIDATE_TO_JOB,
    ADD_CANDIDATE_TO_JOB_SUCCESS,
    ADD_CANDIDATE_TO_JOB_ERROR,
    SET_STATUS_TO_FALSE,
    ADD_CANDIDATE_TO_JOB_THAT_UNSELECTED 
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  statusAdd: false,
  keyAddCandidateToJob: 0
};

/* eslint-disable default-case, no-param-reassign */
const addCandidateToJobReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case ADD_CANDIDATE_TO_JOB:
          draft.loading = true,
          draft.error = null
          // draft.statusAdd = false
        break;
      case ADD_CANDIDATE_TO_JOB_SUCCESS:
        
        draft.loading = false,
        draft.error = null,
        draft.statusAdd = true,
        draft.keyAddCandidateToJob = draft.keyAddCandidateToJob + 1
        break;
      case ADD_CANDIDATE_TO_JOB_ERROR:
        draft.loading = false,
        draft.error = action.error,
        draft.statusAdd = false,
        draft.keyAddCandidateToJob = draft.keyAddCandidateToJob + 1
        break;
      case ADD_CANDIDATE_TO_JOB_THAT_UNSELECTED:
        draft.statusAdd = false,
        draft.keyAddCandidateToJob = draft.keyAddCandidateToJob + 1
        break;
      case SET_STATUS_TO_FALSE:
        draft.statusAdd = false
        draft.keyAddCandidateToJob = 0
        break;
      
    }
  });

export default addCandidateToJobReducer;
