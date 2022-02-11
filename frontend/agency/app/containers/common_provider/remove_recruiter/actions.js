import {
  DELETE_RECRUITER,
  DELETE_RECRUITER_SUCCESS,
  DELETE_RECRUITER_ERROR,
} from './constants';
import { deleteRecruiter } from 'services/api/recruiterService';

function deletetRecruiterAction() {
  return {
    type: DELETE_RECRUITER,
  };
}

function deleteRecruiterSuccess(response) {
  return {
    type: DELETE_RECRUITER_SUCCESS,
    response
  };
}

function deleteRecruiterError(error) {
  return {
    type: DELETE_RECRUITER_ERROR,
    error
  };
}

export default recruiterId => {
  return async dispatch => {
    try {
      dispatch(deletetRecruiterAction());
      const response = await deleteRecruiter(recruiterId);
      dispatch(deleteRecruiterSuccess(response.data));
    } catch (err) {
      dispatch(deleteRecruiterError(err.response?.data));
    }
  }
}
