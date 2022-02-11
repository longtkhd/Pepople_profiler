/*
 *
 * Update agency reducer
 *
 */
import produce from 'immer';
import {
    UPDATE_USER,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    RESET_STATE
} from './constants';

export const initialState = {
    loading: false,
    error: null,
    success: null,
};

/* eslint-disable default-case, no-param-reassign */
const updateUserReducer = (state = initialState, action) =>
    produce(state, draft => {
        switch (action.type) {
            case UPDATE_USER:
                draft.error = null;
                draft.loading = true;
                draft.success = false


                break;
            case UPDATE_USER_SUCCESS:
                draft.error = null;
                draft.loading = false;
                draft.success = action.payload
                break;
            case UPDATE_USER_ERROR:
                draft.error = action.error;
                draft.loading = false;
                draft.success = false
            case RESET_STATE:
                draft.success = null;
                break;
            default:
                break;
        }
    });

export default updateUserReducer;
