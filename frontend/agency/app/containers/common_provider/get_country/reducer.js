import produce from 'immer';
import {
  GET_COUNTRY,
  GET_COUNTRY_SUCCESS,
  GET_COUNTRY_FAILED,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  countries: null,
};

const getCountryReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_COUNTRY:
        draft.error = null;
        draft.loading = true;
        draft.countries = null;
        break;
      case GET_COUNTRY_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.countries = action.response;
        break;
      case GET_COUNTRY_FAILED:
        draft.error = action.error;
        draft.loading = false;
        draft.countries = null;
        break;
      default:
        break;
    }
  });

export default getCountryReducer;
