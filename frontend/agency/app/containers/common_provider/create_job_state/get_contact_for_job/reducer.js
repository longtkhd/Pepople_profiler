/*
 *
 * GET CONTACT FOR JOB reducer
 *
 */
import produce from 'immer';
import {
  INIT_GET_CONTACT_JOB,
  GET_CONTACT_JOB_SUCCESS,
  GET_CONTACT_JOB_FAIL,
  CLEAN_CONTACT_JOB,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  clientContacts: null,
};

/* eslint-disable default-case, no-param-reassign */
const getContactJobReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case INIT_GET_CONTACT_JOB:
        draft.loading = true;
        break;
      case GET_CONTACT_JOB_SUCCESS:
        draft.loading = false;
        draft.clientContacts = action.payload;
        break;
      case GET_CONTACT_JOB_FAIL:
        draft.loading = false;
        draft.clientContacts = action.payload;
        break;
      case CLEAN_CONTACT_JOB:
        draft.loading = false;
        draft.error = null;
        draft.clientContacts = null;
        break;
    }
  });

export default getContactJobReducer;
