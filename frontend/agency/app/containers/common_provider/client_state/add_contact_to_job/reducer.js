/*
 *
 * CLIENT ADD CONTACT TO JOB reducer
 *
 */
import produce from 'immer';
import {
  INIT_ADD_CONTACT_TO_JOB,
  ADD_CONTACT_TO_JOB_SUCCESS,
  ADD_CONTACT_TO_JOB_FAIL,
  CLEAN_UP_ADD_CONTACT_TO_JOB,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
};

/* eslint-disable default-case, no-param-reassign */
const addContactToJobReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case INIT_ADD_CONTACT_TO_JOB:
        draft.loading = true;
        break;
      case ADD_CONTACT_TO_JOB_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case ADD_CONTACT_TO_JOB_FAIL:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case CLEAN_UP_ADD_CONTACT_TO_JOB:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        break;
    }
  });

export default addContactToJobReducer;
