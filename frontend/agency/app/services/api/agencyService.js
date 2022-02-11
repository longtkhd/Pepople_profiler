import API from './index';
import { API_KEY } from 'constants/config';

const AGENCY_KEY = API_KEY.AGENCY_KEY;
const UPDATE_AGENCY_KEY = 'updateAgencyInfo';
const UPDATE_SUBSCRIPTION_KEY = 'updateSubscription';
const VERIFY_CARD_KEY = 'verifyCard';
const GET_RECRUITER_KEY = 'recruiter_list';
const GET_AGENCY_INFO_KEY = 'info';
const GET_SUBSCRIPTION_INFO = 'subscriptionInfo';
const CANCEL_SUBSCRIPTION_INFO = 'cancelCurrentPlan';
const SUBSCRIPTION_PLAN_KEY = 'plan';
const COMPANY_FILE_KEY = 'companyImage';
const UPDATE_PAYMENT_METHOD = 'updateCard';
const PAYMENT_UPDATE_PLAN = 'payment-plan';
const GET_PAYMENT_HISTORY = 'paymentHistories';

export const updateAgencyInfo = params => {
  return API.post(`${AGENCY_KEY}/${UPDATE_AGENCY_KEY}`, params);
}

export const updateAgencyInfoOnSetup = (accessToken, params) => {
  return API.post(`${AGENCY_KEY}/${UPDATE_AGENCY_KEY}`, params, { headers: { authorization: `Bearer ${accessToken}` } });
}

export const updateSubscription = (agencyId, params) => {
  return API.post(`${AGENCY_KEY}/${agencyId}/${SUBSCRIPTION_PLAN_KEY}`, params);
}

export const updateSubscriptionSetup = (accessToken, agencyId, params) => {
  return API.post(`${AGENCY_KEY}/${agencyId}/${SUBSCRIPTION_PLAN_KEY}`, params, { headers: { authorization: `Bearer ${accessToken}` } });
}

export const verifyCard = (agencyId, params) => {
  return API.post(`${AGENCY_KEY}/${agencyId}/${VERIFY_CARD_KEY}`, params);
}

export const verifyCardSetup = (accessToken, agencyId, params) => {
  return API.post(`${AGENCY_KEY}/${agencyId}/${VERIFY_CARD_KEY}`, params, { headers: { authorization: `Bearer ${accessToken}` } });
}

export const getRecruiters = (agencyId, params) => {
  return API.get(`${AGENCY_KEY}/${agencyId}/${GET_RECRUITER_KEY}`, { params });
}

export const getAgencyInfo = (agencyId, params) => {
  return API.get(`${AGENCY_KEY}/${agencyId}/${GET_AGENCY_INFO_KEY}`, params);
}

export const getAgencyInfoSetup = (accessToken, agencyId) => {
  return API.get(`${AGENCY_KEY}/${agencyId}/${GET_AGENCY_INFO_KEY}`, { headers: { authorization: `Bearer ${accessToken}` } });
}

export const getSubscriptionInfo = (agencyId) => {
  return API.get(`${AGENCY_KEY}/${agencyId}/${GET_SUBSCRIPTION_INFO}`);
}

export const cancelSubscriptionInfo = (agencyId) => {
  return API.delete(`${AGENCY_KEY}/${agencyId}/${CANCEL_SUBSCRIPTION_INFO}`);
}

export const paymentUpdatePlanService = (agencyId, params) => {
  return API.post(`${AGENCY_KEY}/${agencyId}/${PAYMENT_UPDATE_PLAN}`, params);
}

export const getListPackage = (agencyId) => {
  return API.get(`${AGENCY_KEY}/${agencyId}/${SUBSCRIPTION_PLAN_KEY}`);
}

export const getListPackageSetup = (accessToken, agencyId) => {
  return API.get(`${AGENCY_KEY}/${agencyId}/${SUBSCRIPTION_PLAN_KEY}`, { headers: { authorization: `Bearer ${accessToken}` } });
}

export const getCompanyFileService = (agencyId, fileID, type) => {
  return API.get(
    `${AGENCY_KEY}/${agencyId}/${COMPANY_FILE_KEY}?fileId=${fileID}&type=${type}`,
    { responseType: 'arraybuffer' },
  );
};

export const getCompanyFileSetup = (accessToken, agencyId, fileID, type) => {
  return API.get(
    `${AGENCY_KEY}/${agencyId}/${COMPANY_FILE_KEY}?fileId=${fileID}&type=${type}`,
    { responseType: 'arraybuffer', headers:  { authorization: `Bearer ${accessToken}` } },
  );
};

export const updatePaymentMethod = (agencyId, data) => {
  return API.put(`${AGENCY_KEY}/${agencyId}/${UPDATE_PAYMENT_METHOD}`, data);
}

export const getPaymentHistories = (agencyId, params) => {
  return API.get(`${AGENCY_KEY}/${agencyId}/${GET_PAYMENT_HISTORY}`, params);
}
