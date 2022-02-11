import produce from 'immer';
import {
  GET_INDUSTRY,
  GET_INDUSTRY_SUCCESS,
  GET_INDUSTRY_FAILED,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  industries: null,
};

const getIndustryReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_INDUSTRY:
        draft.error = null;
        draft.loading = true;
        draft.industries = null;
        break;
      case GET_INDUSTRY_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.industries = action.response;
        break;
      case GET_INDUSTRY_FAILED:
        draft.error = action.error;
        draft.loading = false;
        draft.industries = null;
        break;
      default:
        break;
    }
  });

export default getIndustryReducer;
