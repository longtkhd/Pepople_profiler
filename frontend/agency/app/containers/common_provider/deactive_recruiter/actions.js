import {
  DEACTIVE_RECRUITER,
  DEACTIVE_RECRUITER_SUCCESS,
  DEACTIVE_RECRUITER_FAILED,
  CLEAN_DEACTIVE_RECRUITER,
} from './constants';
import { deactiveRecruiter as deactiveRecruiterService } from 'services/api/recruiterService';

function deactiveRecruiter() {
  return {
    type: DEACTIVE_RECRUITER,
  };
}

function deactiveRecruiterSuccess(response) {
  return {
    type: DEACTIVE_RECRUITER_SUCCESS,
    response,
  };
}

function deactiveRecruiterFailed(error) {
  return {
    type: DEACTIVE_RECRUITER_FAILED,
    error,
  };
}

function cleanDeactiveRecruiter(error) {
  return {
    type: CLEAN_DEACTIVE_RECRUITER,
    error,
  };
}


export default recruiterId => {
  return async dispatch => {
    try {
      dispatch(deactiveRecruiter());
      const response = await deactiveRecruiterService(recruiterId);
      dispatch(deactiveRecruiterSuccess(response.data));
      dispatch(cleanDeactiveRecruiter());
    } catch (err) {
      dispatch(deactiveRecruiterFailed(err.response?.data));
      dispatch(cleanDeactiveRecruiter());
    }
  };
};
