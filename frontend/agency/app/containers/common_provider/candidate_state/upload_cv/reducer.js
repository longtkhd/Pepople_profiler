/*
 *
 * candidates upload reducer
 *
 */
import produce from 'immer';
import {
  CANDIDATE_UPLOAD_INIT,
  CANDIDATE_UPLOAD_SUCCESS,
  CANDIDATE_UPLOAD_FAIL,
  CANDIDATE_CLEAN_UP,
  PREVIEW_LIST_CANDIDATE,
  PREVIEW_LIST_CANDIDATE_EXISTS,
  DELETE_CANDIDATE_PREVIEW,
  DELETE_CANDIDATE_PREVIEW_EXISTS,
  PERCENT_UPLOAD_CANDIDATE_CV,
  CLEAN_CANDIDATE_UPLOAD_CV,
  CLEAR_CANCEL_UPLOAD,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
  previewCandidates: null,
  previewCandidatesExists: [],
  percentUpload: 0,
  isCancelling: false,
  dataParseCv: "",
  statusParseCv: false,
};

/* eslint-disable default-case, no-param-reassign */
const uploadCVReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CANDIDATE_UPLOAD_INIT:
        draft.loading = true;
        break;
      case CANDIDATE_UPLOAD_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        draft.dataParseCv = action.payload;
        if(draft.dataParseCv.data.list[draft.dataParseCv.data.list.length - 1].parse_status == "excess_max_parsing_count"){
          draft.statusParseCv = true;
        }
        
        break;
      case CANDIDATE_UPLOAD_FAIL:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case PREVIEW_LIST_CANDIDATE:
        draft.previewCandidates = action.payload;
        break;
      case PREVIEW_LIST_CANDIDATE_EXISTS:
        draft.previewCandidatesExists = action.payload;
        break;
      case DELETE_CANDIDATE_PREVIEW:
        draft.previewCandidates.splice(
          draft.previewCandidates.findIndex(
            item => item.uid === action.payload.id,
          ),
          1,
        );
        break;
      case DELETE_CANDIDATE_PREVIEW_EXISTS:
        draft.previewCandidatesExists.splice(
          draft.previewCandidatesExists.findIndex(
            item => item.uid === action.payload.id,
          ),
          1,
        );
        break;
      case PERCENT_UPLOAD_CANDIDATE_CV:
        draft.percentUpload = action.payload;
        break;
      case CLEAN_CANDIDATE_UPLOAD_CV:
        draft.previewCandidates = null;
        draft.previewCandidatesExists = [];
        draft.percentUpload = 0;
        draft.result = null;
        draft.loading = false;
        draft.isCancelling = true;
        draft.statusParseCv = false;
        break;
      case CANDIDATE_CLEAN_UP:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        draft.percentUpload = 0;
        // draft.previewCandidates = null;
        break;
      case CLEAR_CANCEL_UPLOAD:
        draft.isCancelling = false;
    }
  });

export default uploadCVReducer;
