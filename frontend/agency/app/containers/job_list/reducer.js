/*
 *
 * JobList reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION } from './constants';

export const initialState = {
  test: ''
};

/* eslint-disable default-case, no-param-reassign */
const jobListReducer = (state = initialState, action) =>
  produce(state, ( draft ) => {
    switch (action.type) {
      case DEFAULT_ACTION:
        draft.test = 'Test ok';
        break;
    }
  });

export default jobListReducer;
