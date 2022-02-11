/*
 *
 * CandidateReportPage reducer
 *
 */
import produce from 'immer';
import { PASS_CANDIDATE_ID_INTO_STORE } from './constants';

export const initialState = {
  candidateId: ''
};

/* eslint-disable default-case, no-param-reassign */
const candidateReportPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case PASS_CANDIDATE_ID_INTO_STORE:
        draft.candidateId = action.candidateId;
        break;
    }
  });

export default candidateReportPageReducer;
