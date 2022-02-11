/*
 *
 * RECRUITMENT ACTIVITY IN JOB reducer
 *
 */
import produce from 'immer';
import {
  INIT_SAVE_RECRUITMENT_ACTIVITY,
  SAVE_RECRUITMENT_ACTIVITY_SUCCESS,
  SAVE_RECRUITMENT_ACTIVITY_FAIL,
  CLEAN_DELETE_SAVE_RECRUIMENT_ACTIVITY,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
};

/* eslint-disable default-case, no-param-reassign */
const saveRecruitmentActivityReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case INIT_SAVE_RECRUITMENT_ACTIVITY:
        draft.loading = true;
        break;
      case SAVE_RECRUITMENT_ACTIVITY_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case SAVE_RECRUITMENT_ACTIVITY_FAIL:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case CLEAN_DELETE_SAVE_RECRUIMENT_ACTIVITY:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        break;
    }
  });

export default saveRecruitmentActivityReducer;
