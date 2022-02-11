import resendVerifyReducer from './resend_verify/reducer';
import createPasswordReducer from './create_password/reducer';
import updateAgencyReducer from './update_agency/reducer';
import updateSubscriptionReducer from './update_subscription/reducer';
import verifyCardReducer from './verify_card/reducer';
import getUserInfoReducer from './get_user_info/reducer';
import getAgencyInfoReducer from './get_agency_info/reducer';
import removeRecruiterReducer from './remove_recruiter/reducer';
import updateRecruiterReducer from './update_recruiter/reducer';
import clientReducer from './client_state/reducer';
import updateUserReducer from './update_user_profile/reducer';
import changePasswordReducer from './change_password/reducer';
import getPackageReducer from './get_package/reducer';

import createJobReducer from './create_job_state/reducer';
import openJobListReducer from './create_job_state/get_job/reducer';
import jobDetailReducer from './create_job_state/get_job_detail/reducer';
import getRecruiterDetailsReducer from './get_recruiter_details/reducer';
import getRecruiterListReducer from './get_recruiter_list/reducer';
import getOpenJobReducer from './get_open_job/reducer';
import getClosedJobReducer from './get_closed_job/reducer';
import getJobReducer from './get_job/reducer';
import candidateUploadReducer from './candidate_state/upload_cv/reducer';
import listCandidateReducer from './candidate_state/get_candidates/reducer';
import deleteContactDetailReducer from './client_state/delete_contact_list/reducer';
import editClientReducer from './client_state/edit_client/reducer';
import editContactClientReducer from './client_state/edit_contact_client/reducer';
import deleteClientReducer from './client_state/delete_client/reducer';
import deteleJobReducer from './create_job_state/delete_job/reducer';
import editJobReducer from './create_job_state/edit_job/reducer';
import listCandidateAddedReducer from './candidate_state/add_candidate_to_list/reducer';
import changeJobStatusReducer from './change_job_status/reducer';
import getArgencyReducer from './agency_list/reducer'
import getAssessmentReducer from './get_assessment/reducer'
import createAssessmentIndustryReducer from './create_assessment_industry/reducer';
import projectAssessmentReducer from './project_assessment/reducer'
import createProjectAssessmentReducer from './project_assessment/create_project_assessment/reducer';
import editProjectAssessmentReducer from './project_assessment/edit_project_assessment/reducer'
import getAssessmentTypeReducer from './get_assessment_type/reducer'
import createAssessmentTypeReducer from './create_assessment_type/reducer'
import subscriptionSumaryReducer from './subscription_sumary/reducer'
import paymentHistoryInfoReducer from './payment_history/reducer'
export default {
  resendVerify: resendVerifyReducer,
  createPassword: createPasswordReducer,
  updateAgency: updateAgencyReducer,
  updateSubscription: updateSubscriptionReducer,
  verifyCard: verifyCardReducer,
  getUserInfo: getUserInfoReducer,
  getAgencyInfo: getAgencyInfoReducer,
  removeRecruiter: removeRecruiterReducer,
  updateRecruiter: updateRecruiterReducer,
  clientState: clientReducer,
  editClientState: editClientReducer,
  editContactClientState: editContactClientReducer,
  deleteClientState: deleteClientReducer,
  updateUser: updateUserReducer,
  changePassword: changePasswordReducer,
  deleteContactDetail: deleteContactDetailReducer,
  getPackage: getPackageReducer,

  createJobState: createJobReducer,
  jobDetailState: jobDetailReducer,
  jobListState: openJobListReducer,
  deleteJobState: deteleJobReducer,
  editJobState: editJobReducer,
  getRecruiterDetails: getRecruiterDetailsReducer,
  getRecruiterList: getRecruiterListReducer,
  getOpenJob: getOpenJobReducer,
  getClosedJob: getClosedJobReducer,
  getJob: getJobReducer,
  changeJobStatus: changeJobStatusReducer,
  candidateUploadState: candidateUploadReducer,
  candidateExistingState: listCandidateReducer,
  listCandidateAddedState: listCandidateAddedReducer,
  getArgency: getArgencyReducer,
  getAssessment: getAssessmentReducer,
  createAssessmentIndustries: createAssessmentIndustryReducer,

  projectAssessmentState: projectAssessmentReducer,
  createProjectAssessmentReducerState: createProjectAssessmentReducer,
  editProjectAssessmentState: editProjectAssessmentReducer,
  getAssessmentType: getAssessmentTypeReducer,
  createAssessmentTypes: createAssessmentTypeReducer,
  subscriptionSumaryState: subscriptionSumaryReducer,
  paymentHistoryInfoState: paymentHistoryInfoReducer




};
