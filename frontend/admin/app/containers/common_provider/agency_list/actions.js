import {
    GET_ARGENCY_LIST,
    GET_ARGENCY_LIST_SUCCESS,
    GET_ARGENCY_LIST_FAILED,
    CLEAN_ARGENCY_LIST,
    GET_ARGENCY_LIST_ID,
    GET_ARGENCY_LIST_ID_SUCCESS,
    GET_ARGENCY_LIST_ID_FAILED,
    DELETE_AGENCY,
    DELETE_AGENCY_SUCCESS,
    DELETE_AGENCY_ERROR,
    DEACTIVE_AGENCY,
    DEACTIVE_AGENCY_SUCCESS,
    DEACTIVE_AGENCY_ERROR,
    RESET_STATE
} from './constants'

import * as argencyService from 'services/api/adminService'

import { CLEAN_CLIENT_LIST } from '../client_state/constants'

export const getArgencyList = (params) => {

    return async dispatch => {
        try {
            dispatch(getArgencyAction())
            const response = await argencyService.getListAgency(params)
            dispatch(getArgencyActionSuccess(response.data))

        } catch (err) {
            dispatch(getArgencyActionFailed())

        }
    }
}

export const getAgencyListById = (params) => {
    return async dispatch => {
        try {
            dispatch(getAgencyById())
            const response = await argencyService.getListAgency(params)
            dispatch(getAgencyByIdSuccess(response.data))
        } catch (e) {
            dispatch(getAgencyByIdError(e))
        }
    }
}



function getArgencyAction(payload) {
    return {
        type: GET_ARGENCY_LIST,
        payload
    }
}

function getArgencyActionSuccess(payload) {
    return {
        type: GET_ARGENCY_LIST_SUCCESS,
        payload
    }
}

function getArgencyActionFailed(payload) {
    return {
        type: GET_ARGENCY_LIST_FAILED
    }
}

function clean(payload) {
    return {
        type: CLEAN_CLIENT_LIST,
        payload

    }
}

function getAgencyById(payload) {
    return {
        type: GET_ARGENCY_LIST_ID,
        payload
    }
}


function getAgencyByIdSuccess(payload) {
    return {
        type: GET_ARGENCY_LIST_ID_SUCCESS,
        payload
    }
}


function getAgencyByIdError(payload) {
    return {
        type: GET_ARGENCY_LIST_ID_FAILED,
        payload
    }
}

function deleteAgencyAction() {
    return {
        type: DELETE_AGENCY
    }
}

function deleteAgencySuccess(payload) {
    return {
        type: DELETE_AGENCY_SUCCESS,
        payload

    }
}

function deleteAgencyError(error) {
    return {
        type: DELETE_AGENCY_ERROR,
        error
    }
}

function resetState() {
    return {
        type: RESET_STATE
    }
}



export const deleteAgencyDefault = (agencyId) => {
    return async dispatch => {
        try {
            dispatch(deleteAgencyAction());
            const res = await (argencyService.deleteAgency(agencyId))
            dispatch(deleteAgencySuccess(res)) 
            dispatch(resetState())
        } catch (e) {
            dispatch(deleteAgencyError(e.response?.data)) 
            dispatch(resetState())
        }
    }
}

function deactiveAgencyAction() {
    return {
        type: DEACTIVE_AGENCY
    }
}

function deactiveAgencySuccess(payload) {
    return {
        type: DEACTIVE_AGENCY_SUCCESS,
        payload
    }
}

function deactiveAgencyError(error) {
    return {
        type: DEACTIVE_AGENCY_ERROR,
        error
    }
}

export const deactiveAgencyDefault = (agencyId) => {
    return async dispatch => {
        try {
            dispatch(deactiveAgencyAction());
            const res = await argencyService.deactiveAgency(agencyId)
            dispatch(deactiveAgencySuccess(res));
            dispatch(resetState())
            
        } catch (e) {
            dispatch(deactiveAgencyError(e.response?.data)) 
            dispatch(resetState())
        }
    }
}