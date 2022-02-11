/*
 *
 * Create password actions
 *
 */

import {
    CHANGE_PASSWORD,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_ERROR,
    RESET_STATE
} from './constants';
import { changePassword } from 'services/api/authService';

export default data => {
    return async dispatch => {
        try {
            dispatch(changePasswordAction());
            const response = await changePassword(data);
            dispatch(changePasswordSuccess(response.data)).then(() => {
                dispatch(resetState())
            });
        } catch (err) {
            dispatch(changePasswordError(err.response?.data));
        }
    }
}

function changePasswordAction(payload) {
    return {
        type: CHANGE_PASSWORD,
        payload
    };
}

function changePasswordSuccess(payload) {
    console.log('aa')
    return {
        type: CHANGE_PASSWORD_SUCCESS,
        payload
    };
}

function changePasswordError(error) {
    return {
        type: CHANGE_PASSWORD_ERROR,
        error
    };
}

export function resetState(payload) {
    return {
        type: RESET_STATE,
        payload
    };
}