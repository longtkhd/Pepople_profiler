/*
 *
 * CandidateReportPage actions
 *
 */

import { PASS_CANDIDATE_ID_INTO_STORE } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

// passCandidateIdIntoStore

export const passCandidateIdIntoStore = candidateId => dispatch => {
    dispatch(initPassCandidateIdIntoStore(candidateId));
};

export const initPassCandidateIdIntoStore = candidateId => {
  return {
    type: PASS_CANDIDATE_ID_INTO_STORE,
    candidateId
  }
  
 
};


// export const initPassCandidateIdIntoStore = candidateId => ({
  
//   type: PASS_CANDIDATE_ID_INTO_STORE,
//   candidateId
// });


