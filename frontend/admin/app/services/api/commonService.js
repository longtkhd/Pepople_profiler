import API from './index';
import { API_KEY } from 'constants/config';

const COMMON_KEY = API_KEY.COMMON_KEY;
const GET_ASSESSMENT_INDUSTRY = 'getAssessmentIndustry';

const GET_PROJECT_ASSESSMENT = 'getProjectAssessment';
const GET_PROJECT_ASSESSMENT_BY_ID = 'getProjectAssessmentById'
const GET_ASSESSMENT_TYPE = 'getAssessmentType';
const GET_ASSESSMENT_TYPE_BY_ID = 'getAssessmentTypeById'



export const getAssessment = params => {
    return API.get(`${COMMON_KEY}/${GET_ASSESSMENT_INDUSTRY}`)
}

export const getAssessmentById = (id) => {
    // console.log(id)
    return API.get(`${COMMON_KEY}/${GET_ASSESSMENT_INDUSTRY}/${id}`)
}


export const getProjectAssessment = params => {
    return API.get(`${COMMON_KEY}/${GET_PROJECT_ASSESSMENT}`, params)
}

export const getProjectAssessmentById = (id) => {
    return API.get(`${COMMON_KEY}/${GET_PROJECT_ASSESSMENT_BY_ID}/${id}`)
}



export const getAssessmentTypeInfo = params => {

    return API.get(`${COMMON_KEY}/${GET_ASSESSMENT_TYPE}`)
}

export const getAssessmentTypeById = (id) => {
    return API.get(`${COMMON_KEY}/${GET_ASSESSMENT_TYPE_BY_ID}/${id}`)
}




