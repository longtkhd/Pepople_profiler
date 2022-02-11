import resendVerifyReducer from './resend_verify/reducer';
import createPasswordReducer from './create_password/reducer';
import createPasswordSetupReducer from './create_password_setup/reducer';
import updateAgencyReducer from './update_agency/reducer';
import updateAgencySetupReducer from './update_agency_setup/reducer';
import updateSubscriptionReducer from './update_subscription/reducer';
import updateSubscriptionSetupReducer from './update_subscription_setup/reducer';
import verifyCardReducer from './verify_card/reducer';
import verifyCardSetupReducer from './verify_card_setup/reducer';
import getUserInfoReducer from './get_user_info/reducer';
import getAgencyInfoReducer from './get_agency_info/reducer';
import getAgencyInfoSetupReducer from './get_agency_info_setup/reducer';
import removeRecruiterReducer from './remove_recruiter/reducer';
import updateRecruiterReducer from './update_recruiter/reducer';
import deactiveRecruiterReducer from './deactive_recruiter/reducer';
import clientReducer from './client_state/reducer';
import updateUserReducer from './update_user_profile/reducer';
import changePasswordReducer from './change_password/reducer';
import getPackageReducer from './get_package/reducer';
import getPackageSetupReducer from './get_package_setup/reducer';

import createJobReducer from './create_job_state/reducer';
import openJobListReducer from './create_job_state/get_job/reducer';
import changeStatusJobReducer from './create_job_state/change_status_job/reducer';
import getContactJobReducer from './create_job_state/get_contact_for_job/reducer';
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
import clientContactInJobReducer from './create_job_state/get_contact_in_job/reducer';
import addContactToJobReducer from './client_state/add_contact_to_job/reducer';
import inviteContactJobReducer from './client_state/invite_contact_on_job/reducer';
import getShortlistedCandidateReducer from './candidate_state/get_shortlisted_candidate_job/reducer';
import deleteCandidateReducer from './candidate_state/delete_candidate_in_list/reducer';
import editCandidateReducer from './candidate_state/edit_candidate_in_list/reducer';
import deleteContactJobReducer from './create_job_state/delete_client_in_job/reducer';
import addMoreContactToJobReducer from './client_state/add_more_contact_to_job/reducer';
import saveRecruitmentActivityReduer from './create_job_state/activity_recruitment_job/reducer';
import candidateDetailReducer from './candidate_state/get_candidate_detail/reducer';
import getNotificationReducer from './get_notification/reducer';
import updateServerNotificationReducer from './update_server_notification/reducer';

import getCountryReducer from './get_country/reducer';
import getIndustryReducer from './get_industry/reducer';
import getClientFeedbackReducer from './client_state/get_client_feedback/reducer';
import revokeJobClientReducer from './client_state/revoke_contact_on_job/reducer';
import requestChangeMailReducer from './request_change_mail/reducer';
import candidateDocumentsReducer from './candidate_state/candidate_document/reducer';
import exportCandidateReportPdfReducer from './export_candidate_report_pdf/reducer';
import exportJobActivityPdfReducer from './export_job_activity_report_pdf/reducer';
import addCandidateToJobReducer from './candidate_state/add_candidate_to_job/reducer';
import updateNotificationReducer from './update_notification/reducer';
import updateNotificationSettingSetupReducer from './update_notification_setting_setup/reducer';
import createContactClientReducer from './client_state/create_contact_client/reducer';
import clientDetailInfoReducer from './client_state/client_detail_info/reducer';
import sendMailAssessmentReducer from './send_mail_assessment/reducer';
import chargesInviteReducer from './charges_invite_state/reducer';

export default {
  resendVerify: resendVerifyReducer,
  createPassword: createPasswordReducer,
  createPasswordSetup: createPasswordSetupReducer,
  updateAgency: updateAgencyReducer,
  updateAgencySetup: updateAgencySetupReducer,
  updateSubscription: updateSubscriptionReducer,
  updateSubscriptionSetup: updateSubscriptionSetupReducer,
  verifyCard: verifyCardReducer,
  verifyCardSetup: verifyCardSetupReducer,
  getUserInfo: getUserInfoReducer,
  getAgencyInfo: getAgencyInfoReducer,
  getAgencyInfoSetup: getAgencyInfoSetupReducer,
  removeRecruiter: removeRecruiterReducer,
  updateRecruiter: updateRecruiterReducer,
  deactiveRecruiter: deactiveRecruiterReducer,
  clientState: clientReducer,
  editClientState: editClientReducer,
  editContactClientState: editContactClientReducer,
  clientContactInJobState: clientContactInJobReducer,
  deleteClientState: deleteClientReducer,
  addContactToJobState: addContactToJobReducer,
  addMoreContactToJobState: addMoreContactToJobReducer,
  inviteContactJobState: inviteContactJobReducer,
  shortlistedCandidateJobState: getShortlistedCandidateReducer,
  deleteCandidateState: deleteCandidateReducer,
  editCandidateState: editCandidateReducer,
  deleteContactJobState: deleteContactJobReducer,
  saveRecruitmentActivityState: saveRecruitmentActivityReduer,

  updateUser: updateUserReducer,
  changePassword: changePasswordReducer,
  deleteContactDetail: deleteContactDetailReducer,
  getPackage: getPackageReducer,
  getPackageSetup: getPackageSetupReducer,

  clientDetailInfoState: clientDetailInfoReducer,
  createContactClientState: createContactClientReducer,
  createJobState: createJobReducer,
  jobDetailState: jobDetailReducer,
  clientContactJobState: getContactJobReducer,
  jobListState: openJobListReducer,
  deleteJobState: deteleJobReducer,
  changeStatusJobState: changeStatusJobReducer,
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
  addCandidateToJobState: addCandidateToJobReducer,
  candidateDetailState: candidateDetailReducer,
  getNotification: getNotificationReducer,
  updateServerNotification: updateServerNotificationReducer,
  candidateDocuments: candidateDocumentsReducer,

  getCountry: getCountryReducer,
  getIndustry: getIndustryReducer,
  getClientFeedback: getClientFeedbackReducer,
  revokeJonClient: revokeJobClientReducer,
  requestChangeMailState: requestChangeMailReducer,
  exportCandidateReportPdf: exportCandidateReportPdfReducer,
  exportJobActivityPdf:exportJobActivityPdfReducer,
  updateNotification: updateNotificationReducer,
  updateNotificationSettingSetup: updateNotificationSettingSetupReducer,
  sendMailAssessmentState : sendMailAssessmentReducer,
  chargesInvite: chargesInviteReducer
};
