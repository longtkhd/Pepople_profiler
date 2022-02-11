/*
 *
 * RecruiterInvite reducer
 *
 */
import produce from 'immer';
import {
  INVITED,
  INVITE_LOAD_ON,
  INVITE_LOAD_OFF,
  INVITE_ERROR,
  CLEAN_UP_DATA,
  CHARGES_INVITE,
  CHARGES_INVITE_SUCCESS,
  CHARGES_INVITE_ERROR,
  CLEAN_CHARGES_INVITE,
} from './constants'

export const initialState = {
  loading: false,
  error: null,
  message: null,
  recruiterList: null,
  chargesInvite: false,
  chargesLoading: false,
  chargesError: null
};

/* eslint-disable default-case, no-param-reassign */
const recruiterInviteReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case INVITE_LOAD_ON:
        draft.loading = true;
        break;
      case INVITE_LOAD_OFF:
        draft.loading = false;
        break;
      case INVITED:
        draft.message = 'Invite recruiter success!';
        draft.recruiterList = action.payload;
        break;
      case INVITE_ERROR:
        draft.message = null;
        draft.error = action.payload;
        break;
      case CLEAN_UP_DATA:
        draft.message = null;
        draft.recruiterList = null;
        draft.error = null;
        break;
      case CHARGES_INVITE:
        draft.chargesLoading = true;
        draft.chargesInvite = false;
        draft.chargesError = null;
        break;
      case CHARGES_INVITE_SUCCESS:
        draft.chargesInvite = action.payload.data;
        draft.chargesLoading = false;
        draft.chargesError = null;
        break;
      case CHARGES_INVITE_ERROR:
        draft.chargesLoading = false;
        draft.chargesInvite = false;
        draft.chargesError = action.error
        break;
      case CLEAN_CHARGES_INVITE:
        draft.chargesLoading = false;
        draft.chargesError = null;
        draft.chargesInvite = false;
        break;
      default:
        break;
    }
  });

export default recruiterInviteReducer;
