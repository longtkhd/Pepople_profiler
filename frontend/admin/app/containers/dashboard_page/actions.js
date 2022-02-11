/*
 *
 * DashboardPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_USER_COUNT,
  GET_USER_COUNT_SUCCESS,
  GET_USER_COUNT_ERROR,
  GET_COUNT_PARSING,
  GET_COUNT_PARSING_SUCCESS,
  GET_COUNT_PARSING_ERROR,
  GET_COUNT_ASSESSMENT,
  GET_COUNT_ASSESSMENT_SUCCESS,
  GET_COUNT_ASSESSMENT_ERROR,
  GET_COUNT_SUBSCRIPTION,
  GET_COUNT_SUBSCRIPTION_SUCCESS,
  GET_COUNT_SUBSCRIPTION_ERROR
} from './constants';
import {
  getUserCount,
  getCountParsing,
  getCountAssessment,
  getCountSubscription
} from 'services/api/adminService'

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getUserCountAction() {
  return {
    type: GET_USER_COUNT
  }
}

export function getUserCountSuccess(payload) {
  return {
    type: GET_USER_COUNT_SUCCESS,
    payload
  }
}

export function getUserCountError(error) {
  return {
    type: GET_USER_COUNT_ERROR,
    error
  }
}

export default () => {
  return async dispatch => {
    try {
      dispatch(getUserCountAction());
      const res = await getUserCount();
      dispatch(getUserCountSuccess(res.data));

    } catch (e) {
      dispatch(getUserCountError(e.response?.data))
    }
  }
}

function getCountParsingAction() {
  return {
    type: GET_COUNT_PARSING
  }
}

function getCountParsingSuccess(payload) {
  return {
    type: GET_COUNT_PARSING_SUCCESS,
    payload
  }
}

function getCountParsingError(error) {
  return {
    type: GET_COUNT_PARSING_ERROR,
    error
  }
}

export const getCountParsingDefault = (params) => {

  return async dispatch => {
    try {
      dispatch(getCountParsingAction());

      const res = await getCountParsing(params);
      dispatch(getCountParsingSuccess(res.data))

    } catch (err) {
      dispatch(getCountParsingError(err.response?.data))
    }
  }

}

function getCountAssessmentAction() {
  return {
    type: GET_COUNT_ASSESSMENT
  }
}

function getCountAssessmentSuccess(payload) {
  return {
    type: GET_COUNT_ASSESSMENT_SUCCESS,
    payload
  }
}

function getCountAssessmentError(error) {
  return {
    type: GET_COUNT_ASSESSMENT_ERROR,
    error
  }
}

export const getCountAssessmentDefault = (params) => {
  return async dispatch => {
    try {
      dispatch(getCountAssessmentAction());
      const res = await getCountAssessment(params);
      dispatch(getCountAssessmentSuccess(res.data));

    } catch (e) {
      dispatch(getCountAssessmentError(e.response?.data))

    }
  }
}


function getCountSubscriptionAction() {
  return {
    type: GET_COUNT_SUBSCRIPTION
  }
}

function getCountSubscriptionSuccess(payload) {
  return {
    type: GET_COUNT_SUBSCRIPTION_SUCCESS,
    payload
  }
}

function getCountSubscriptionError(error) {
  return {
    type: GET_COUNT_SUBSCRIPTION_ERROR,
    error
  }
}

export const getCountSubscriptionDefault = (params) => {
  return async dispatch => {
    try {
      dispatch(getCountSubscriptionAction());
      const res = await getCountSubscription(params)
      dispatch(getCountSubscriptionSuccess(res.data))

    } catch (e) {
      dispatch(getCountSubscriptionError(e.response?.data))

    }
  }
}



