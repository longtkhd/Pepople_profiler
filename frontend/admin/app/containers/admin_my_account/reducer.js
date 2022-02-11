/*
 *
 * AdminMyAccount reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_ERROR,
  RESET_STATE
} from './constants';

export const initialState = {
    loading: false,
    error: null,
    success: null,
};

/* eslint-disable default-case, no-param-reassign */
const adminMyAccountReducer = (state = initialState, action) =>
  produce(state,  draft  => {
    switch (action.type) {
       case CHANGE_PASSWORD:
                draft.error = null;
                draft.loading = true;
                draft.success = false;
                break;
            case CHANGE_PASSWORD_SUCCESS:
                draft.error = null;
                draft.loading = false;
                draft.success = action.payload;
                console.log(action)
                break;
            case CHANGE_PASSWORD_ERROR:
                draft.error = action.error
                draft.loading = false;
                draft.success = false;
                break;
            case RESET_STATE:
                draft.error = null;
                draft.loading = false;
                draft.success = null;
            default:
                break;
    }
  });

export default adminMyAccountReducer;
