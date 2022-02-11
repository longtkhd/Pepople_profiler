/*
 *
 * edit candidate in list reducer
 *
 */
import produce from 'immer';
import {
  INIT_EDIT_CANDIDATE,
  EDIT_CANDIDATE_SUCCESS,
  EDIT_CANDIDATE_FAIL,
  CLEAN_UP_EDIT_CANDIDATE,
  SAVE_REPORT_FORM,

} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
  saveReportForm: false,
};

/* eslint-disable default-case, no-param-reassign */
const editCandidateReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case INIT_EDIT_CANDIDATE:
        draft.loading = true;
        break;
      case EDIT_CANDIDATE_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case EDIT_CANDIDATE_FAIL:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case CLEAN_UP_EDIT_CANDIDATE:
        draft.loading = false;
        draft.result = null;
        draft.error = null;
        break;
      case SAVE_REPORT_FORM:
        draft.saveReportForm = action.payload;
        break;
    }
  });

export default editCandidateReducer;
