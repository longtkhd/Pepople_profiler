/*
 *
 * Update agency actions
 *
 */

import {
    UPDATE_USER,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    RESET_STATE
} from './constants';
import { updateProfile } from 'services/api/userService';
import { getUserInfo } from 'services/authentication';

export default data => {
    return async dispatch => {
        try {
            dispatch(updateUser(data));
            const response = await updateProfile(data);
            dispatch(updateUserSuccess(response.data)).then(() => {
                dispatch(resetState())
            })

        } catch (err) {
            dispatch(updateUserError(err.response?.data));
        }
    }
}

function updateUser(payload) {
    return {
        type: UPDATE_USER,
        payload
    };
}

function updateUserSuccess(payload) {
    return {
        type: UPDATE_USER_SUCCESS,
        payload
    };
}

function updateUserError(error) {
    return {
        type: UPDATE_USER_ERROR,
        error
    };
}


function resetState(payload) {
    return {
        type: RESET_STATE,
        payload
    };
}