/*
 *
 * DELETE CONTACT IN JOB reducer
 *
 */
import produce from 'immer';
import {
  INIT_DELETE_CONTACT_JOB,
  DELETE_CONTACT_JOB_SUCCESS,
  DELETE_CONTACT_JOB_FAIL,
  CLEAN_DELETE_CONTACT_JOB,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
};

/* eslint-disable default-case, no-param-reassign */
const deleteContactJobReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case INIT_DELETE_CONTACT_JOB:
        draft.loading = true;
        break;
      case DELETE_CONTACT_JOB_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case DELETE_CONTACT_JOB_FAIL:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case CLEAN_DELETE_CONTACT_JOB:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        break;
    }
  });

export default deleteContactJobReducer;
