/*
 *
 * RECRUITMENT ACTIVITY IN JOBS actions
 *
 */

import {
  INIT_SAVE_RECRUITMENT_ACTIVITY,
  SAVE_RECRUITMENT_ACTIVITY_SUCCESS,
  SAVE_RECRUITMENT_ACTIVITY_FAIL,
  CLEAN_DELETE_SAVE_RECRUIMENT_ACTIVITY,
} from './constants';

import * as jobService from 'services/api/jobService';

export const saveRecuitmentActivity = (
  jobId,
  payload,
  params,
) => async dispatch => {
  try {
    dispatch(initSaveRecruitment());
    const res = await jobService.activityRecuitment(jobId, payload, params);
    dispatch(saveRecruitmentSuccess(res.data));
  } catch (error) {
    dispatch(saveRecruitmentFail(error));
  }
};

export const initSaveRecruitment = () => ({
  type: INIT_SAVE_RECRUITMENT_ACTIVITY,
});

export const saveRecruitmentSuccess = payload => ({
  type: SAVE_RECRUITMENT_ACTIVITY_SUCCESS,
  payload,
});

export const saveRecruitmentFail = payload => ({
  type: SAVE_RECRUITMENT_ACTIVITY_FAIL,
  payload,
});

export const cleanSaveRecruitment = () => ({
  type: CLEAN_DELETE_SAVE_RECRUIMENT_ACTIVITY,
});
