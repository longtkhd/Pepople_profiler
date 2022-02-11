import API from './index';
import { API_KEY } from 'constants/config';



const PROJECT_KEY = API_KEY.PROJECT_KEY;

const ADD_PROJECT_ASSESSMENT = '/addProjectAssessment'
const EDIT_PROJECT_ASSESSMENT = 'editProjectAssessment'
const DELETE_PROJECT_ASSESSMENT = 'deleteProjectAssessment'


export const createProjectAssessment = params => {
    return API.post(PROJECT_KEY + ADD_PROJECT_ASSESSMENT, params)
}

export const editProjectAssessment = (id, data) => {
    console.log('here')
    return API.post(`${PROJECT_KEY}/${EDIT_PROJECT_ASSESSMENT}/${id}`, data)
}

export const deleteProjectAssessment = (id) => {
    return API.delete(`${PROJECT_KEY}/${DELETE_PROJECT_ASSESSMENT}/${id}`)
}