import API from './index';
import { API_KEY } from 'constants/config';

const COMMON_KEY = API_KEY.COMMON_KEY;
const COUNTRY = 'countries';
const INDUSTRY = 'industry';
const ASSESSMENT_INDUSTRY = 'getAssessmentIndustry';
const ASSESSMENT_TYPE = 'getAssessmentType';
const PROJECT_ASSESSMENT = 'getProjectAssessment'


const getCountries = () => {
  return API.get(`${COMMON_KEY}/${COUNTRY}`);
};

const getIndustries = () => {
  return API.get(`${COMMON_KEY}/${INDUSTRY}`);
};

const getAssessmentIndustryService = () => {
  return API.get(`${COMMON_KEY}/${ASSESSMENT_INDUSTRY}`);
}

const getAssessmentTypeService = () => {
  return API.get(`${COMMON_KEY}/${ASSESSMENT_TYPE}`);
}

const getProjectAssessmentService = (industryId, typeId) => {
  return API.get(`${COMMON_KEY}/${PROJECT_ASSESSMENT}?industry=${industryId}&type=${typeId}`);
}

export {
  getCountries,
  getIndustries,
  getAssessmentIndustryService,
  getAssessmentTypeService,
  getProjectAssessmentService
}