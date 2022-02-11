/*
 *
 * CreateNewJob actions
 *
 */

import {
  CREATE_NEW_INIT,
  CREATE_NEW_SUCCESS,
  CREATE_NEW_FAIL,
} from './constants';


export const createJobInit = () => ({
  type : CREATE_NEW_INIT,
});

export const createdJobSuccess = payload => ({
  type : CREATE_NEW_SUCCESS,
  payload
});
export const createJobError = payload => ({
  type : CREATE_NEW_FAIL,
  payload
});


// export const editJob = (id, payload) => ({
//   type: EDIT_JOB,
//   id,
//   payload
// });
