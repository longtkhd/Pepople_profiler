/*
 *
 * RecruiterInviteCsv reducer
 *
 */
import produce from 'immer';
import {
  INVITE_CSV_LOAD,
  INVITE_CSV_SUCCESS,
  INVITE_CSV_FAIL,
  CLEAN_UP_DATA,
  CHARGES_INVITE_SUCCESS,
  CHARGES_INVITE_ERROR,
  CHARGES_INVITE,
  CLEAN_CHARGES_INVITE
} from './constants';


export const initialState = {
  invitedSuccess: null,
  inviteLoading: false,
  recruiterList: null,
  error: null,
  chargesInvite: false,
  chargesLoading: false,
  chargesError: null
};

/* eslint-disable default-case, no-param-reassign */
const recruiterInviteCsvReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case INVITE_CSV_LOAD:
        draft.inviteLoading = true;
        break;
      case INVITE_CSV_SUCCESS:
        draft.inviteLoading = false;
        draft.invitedSuccess = true;
        draft.recruiterList = action.payload;
        break;
      case INVITE_CSV_FAIL:
        draft.inviteLoading = false;
        draft.invitedSuccess = false;
        draft.error = action.payload;
        break;
      case CLEAN_UP_DATA:
        draft.recruiterList = null;
        draft.invitedSuccess = null;
        draft.error = null;
        break;
      case CHARGES_INVITE:
        draft.chargesLoading = false;
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

export default recruiterInviteCsvReducer;
