import {
  GET_JOB_LIST,
  GET_JOB_LIST_SUCCESS,
  GET_JOB_LIST_ERROR,
} from './constants';
import { getJobListService } from 'services/api/jobService';

export const getJobListAction = () => {
  return {
    type: GET_JOB_LIST,
  };
}

export const getJobListSuccess = response => {
  return {
    type: GET_JOB_LIST_SUCCESS,
    response
  };
}

export const getJobListError = error => {
  return {
    type: GET_JOB_LIST_ERROR,
    error
  };
}

export const getJobListExcludeCandidateId = (agencyId, param)  => {
  return async dispatch => {
    try {
      dispatch(getJobListAction());
      const response = await getJobListService(agencyId, param);
      if(response.data?.success){
        dispatch(getJobListSuccess(response?.data));
      }
      
    } catch (err) {
      dispatch(getJobListError(err.response?.data));
    }
  }
}
