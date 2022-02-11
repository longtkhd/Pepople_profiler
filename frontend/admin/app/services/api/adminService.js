import API from './index';
import { API_KEY } from 'constants/config';

const ADMIN_KEY = API_KEY.ADMIN_KEY;
const LOGIN_KEY = '/login';

const AGENCY_LIST = 'agencies';

const ADD_ASSESSMENT_INDUSTY = '/addAssessmentIndustry';
const DELETE_ASSESSMENT_INDUSTRY = 'deleteAssessmentIndustry'
const EDIT_ASSESSMENT = 'editAssessmentIndustry'
const ADD_ASSESSMENT_TYPE = '/addAssessmentType'
const DELETE_ASSESSMENT_TYPE = 'deleteAssessmentType'
const EDIT_ASSESSMENT_TYPE = 'editAssessmentType'
const GET_USER_COUNT = 'countUser'
const GET_COUNT_PARSING = 'getCountParsing'
const GET_COUNT_ASSESSMENT = 'getCountAssessment'
const GET_COUNT_SUBSCRIPTION = 'getCountSubscription'
const DELETE_AGENCY = 'deleteAgency'
const DEACTIVE_AGENCY = 'Deactive'




export const login = params => {
    return API.post(ADMIN_KEY + LOGIN_KEY, params);
};


export const getListAgency = (params) => {
    return API.get(`${ADMIN_KEY}/${AGENCY_LIST}`, params);
}

export const createAssessmentIndustry = params => {
    return API.post(ADMIN_KEY + ADD_ASSESSMENT_INDUSTY, params)
}

export const deleteAssessmentIndustry = id => {
    return API.delete(`${ADMIN_KEY}/${DELETE_ASSESSMENT_INDUSTRY}/${id}`)

}

export const editAssessmentIndustry = (id, data) => {
    return API.post(`${ADMIN_KEY}/${EDIT_ASSESSMENT}/${id}`, data)
}

export const addAssessmentType = params => {
    return API.post(ADMIN_KEY + ADD_ASSESSMENT_TYPE, params)
}

export const deleteAssessmentType = id => {
    return API.delete(`${ADMIN_KEY}/${DELETE_ASSESSMENT_TYPE}/${id}`)
}

export const editAssessmentType = (id, data) => {
    return API.post(`${ADMIN_KEY}/${EDIT_ASSESSMENT_TYPE}/${id}`, data)
}

export const getUserCount = () => {
    return API.get(`${ADMIN_KEY}/${GET_USER_COUNT}`)
}

export const getCountParsing = (params) => {
    return API.get(`${ADMIN_KEY}/${GET_COUNT_PARSING}`, params)
}

export const getCountAssessment = (params) => {
    return API.get(`${ADMIN_KEY}/${GET_COUNT_ASSESSMENT}`, params)
}

export const getCountSubscription = (params) => {
    return API.get(`${ADMIN_KEY}/${GET_COUNT_SUBSCRIPTION}`, params)
}

export const deleteAgency = (agencyId) => {
    return API.delete(`${ADMIN_KEY}/${agencyId}/${DELETE_AGENCY}`)
}

export const deactiveAgency = (agencyId) => {
    return API.post(`${ADMIN_KEY}/${agencyId}/${DEACTIVE_AGENCY}`)
}
