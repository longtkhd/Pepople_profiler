import {
  GET_INDUSTRY,
  GET_INDUSTRY_SUCCESS,
  GET_INDUSTRY_FAILED,
} from './constants';
import { getIndustries } from 'services/api/commonService';

function getIndustry() {
  return {
    type: GET_INDUSTRY,
  };
}

function getIndustrySuccess(response) {
  return {
    type: GET_INDUSTRY_SUCCESS,
    response,
  };
}

function getIndustryFailed(error) {
  return {
    type: GET_INDUSTRY_FAILED,
    error,
  };
}

export default () => {
  return async dispatch => {
    try {
      dispatch(getIndustry());
      const response = await getIndustries();
      dispatch(getIndustrySuccess(response.data));
    } catch (error) {
      dispatch(getIndustryFailed(error.response?.data));
    }
  };
};
