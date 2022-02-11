/*
 *
 * GET CONTACT IN JOB reducer
 *
 */
import produce from 'immer';
import {
  INIT_GET_CONTACT_IN_JOB,
  GET_CONTACT_IN_JOB_SUCCESS,
  GET_CONTACT_IN_JOB_FAIL,
  CLEAN_CONTACT_IN_JOB,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  contactInJob: null,
};

/* eslint-disable default-case, no-param-reassign */
const getContactInJobReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case INIT_GET_CONTACT_IN_JOB:
        draft.loading = true;
        break;
      case GET_CONTACT_IN_JOB_SUCCESS:
        draft.loading = false;
        draft.contactInJob = action.payload;
        break;
      case GET_CONTACT_IN_JOB_FAIL:
        draft.loading = false;
        draft.contactInJob = action.payload;
        break;
      case CLEAN_CONTACT_IN_JOB:
        draft.loading = false;
        draft.error = null;
        draft.contactInJob = null;
        break;
    }
  });

export default getContactInJobReducer;
