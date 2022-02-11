/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from 'components/private_route/loadable';
import LoginPage from 'containers/login_page/loadable';
import NotFoundPage from 'containers/not_found_page/loadable';
import SignUpPage from 'containers/sign_up_page/loadable';
import SetupAgencyPage from 'containers/setup_agency_page/loadable';
import RecruiterListPage from 'containers/recruiter_list_page/loadable';
import RecruiterDetailsPage from 'containers/recruiter_details_page/loadable';
import JoinPage from 'containers/join_page/loadable';
import JobListPage from 'containers/job_list/loadable';
import CreateNewJobDetail from 'containers/create_new_job_detail/loadable';
import JobDashBoard from 'containers/job_dashboard/loadable';
import RecruiterInvitePage from 'containers/recruiter_invite/loadable';
import FinishAssessmentsPage from 'containers/finish-assessments/loadable';
import RecruiterJobPage from 'containers/recruiter_job/loadable';
import RecruiterInviteCSV from 'containers/recruiter_invite_csv/loadable';
import MyAccount from 'containers/my_account/loadable';
import ClientListPage from 'containers/client_list_page/loadable';
import ClientDetailPage from 'containers/client_detail_page/loadable';
import ClientCreatePage from 'containers/client_create_page/loadable';
import SubscriptionInfoPage from 'containers/subscription_info_page/loadable';
import RecruiterEmailSettings from 'containers/recruiter_email_settings/loadable';
import EditEmailTemplate from 'containers/edit_email_template/loadable';
import ForgotPassword from 'containers/forgot-password/loadable';
import ResetPassword from 'containers/reset-password/loadable';
import SubscriptionPlanPage from 'containers/subscription_plan_page/loadable';
import AdminUpdatePaymentMethod from 'containers/admin_update_payment_method/loadable';
import AdminAgencyInfoPage from 'containers/admin_agency_info_page/loadable';
import SettingPage from 'containers/setting_page/loadable';
import NotificationSetting from 'containers/notification_setting/loadable';
import CandidateReportPreview from 'containers/candidate_report_preview/loadable';
import ClientCandidateReport from 'containers/client_candidate_report/loadable';
import NotificationListPage from 'containers/notification_list_page/loadable';
import CandidateReportPage from 'containers/candidate_report_page/loadable';
import ClientJobDashboard from 'containers/client_job_dashboard/loadable';
import AgencyDetailsPage from 'containers/agency_details_page/loadable';
import InviteClientEmail from 'containers/invite_client_email/loadable';
import InviteAssessmentEmail from 'containers/invite_assessment_email/loadable';
import CreateContactClientPage from 'containers/create_contact_client_page/loadable';
import InviteAllClientEmail from 'containers/invite_all_client_email/loadable';

export default function App() {
  return (
    <>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/sign-up" component={SignUpPage} />
        <Route path="/setup" component={SetupAgencyPage} />
        <Route path="/join" component={JoinPage} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />

        <Route
          path="/client-job-dashboard/:invite_token"
          component={ClientJobDashboard}
          exact
        />
        <Route
          path="/client-candidate-report/:invite_token"
          component={ClientCandidateReport}
          exact
        />
        <Route path="/finish-assessments" component={FinishAssessmentsPage} />
        {/* Agency only */}
        <PrivateRoute
          path="/recruiter-list"
          component={RecruiterListPage}
          meta={{ roles: ['agency'] }}
        />
        <PrivateRoute
          path="/recruiter-details/:recruiterId"
          component={RecruiterDetailsPage}
          meta={{ roles: ['agency'] }}
        />
        <PrivateRoute
          path="/agency-details/:id"
          component={AgencyDetailsPage}
          meta={{ roles: ['agency'] }}
        />
        <PrivateRoute
          path="/recruiter-jobs/:recruiterId"
          component={RecruiterJobPage}
          meta={{ roles: ['agency'] }}
        />
        <PrivateRoute
          path="/manual-invite"
          component={RecruiterInvitePage}
          meta={{ roles: ['agency'] }}
        />
        <PrivateRoute
          exact
          path="/csv-invite"
          component={RecruiterInviteCSV}
          meta={{ roles: ['agency'] }}
        />
        <PrivateRoute
          exact
          path="/subscription-info"
          component={SubscriptionInfoPage}
          meta={{ roles: ['agency'] }}
        />
        <PrivateRoute
          exact
          path="/plans"
          component={SubscriptionPlanPage}
          meta={{ roles: ['agency'] }}
        />
        <PrivateRoute
          path="/agency-info"
          component={AdminAgencyInfoPage}
          meta={{ roles: ['agency'] }}
        />
        <PrivateRoute
          exact
          path="/payment-method"
          component={AdminUpdatePaymentMethod}
          meta={{ roles: ['agency'] }}
        />
        <PrivateRoute
          path="/settings"
          component={SettingPage}
          meta={{ roles: ['agency', 'recruiter'] }}
        />
        {/* Agency and Recruiter */}
        <PrivateRoute
          exact
          path="/"
          meta={{ roles: ['agency', 'recruiter'] }}
        />
        <PrivateRoute
          path="/notification-settings"
          component={NotificationSetting}
          meta={{ roles: ['agency', 'recruiter'] }}
        />
        <PrivateRoute
          path="/client-list"
          component={ClientListPage}
          meta={{ roles: ['agency'] }}
        />
        <PrivateRoute
          path="/job-list"
          component={JobListPage}
          meta={{ roles: ['agency', 'recruiter'] }}
        />
        <PrivateRoute
          path="/create-new-job/:jobId"
          component={CreateNewJobDetail}
          meta={{ roles: ['agency', 'recruiter'] }}
        />
        <PrivateRoute
          path="/job-dashboard/:jobId"
          component={JobDashBoard}
          meta={{ roles: ['agency', 'recruiter'] }}
        />
        <PrivateRoute
          path="/client-detail/:clientId"
          component={ClientDetailPage}
          meta={{ roles: ['agency'] }}
        />
        <PrivateRoute
          path="/client-create"
          component={ClientCreatePage}
          meta={{ roles: ['agency'] }}
        />
        <PrivateRoute
          path="/client-create-contact/:clientId"
          component={CreateContactClientPage}
          meta={{ roles: ['agency'] }}
        />
        <PrivateRoute
          path="/my-account"
          component={MyAccount}
          meta={{ roles: ['agency', 'recruiter'] }}
        />
        <PrivateRoute
          path="/recruiter-email-settings"
          component={RecruiterEmailSettings}
          meta={{ roles: ['agency', 'recruiter'] }}
        />
        <PrivateRoute
          path="/candidate-report-preview/:candidateId"
          component={CandidateReportPreview}
          meta={{ roles: ['agency', 'recruiter'] }}
        />
        <PrivateRoute
          path="/invite_client_email/:id"
          component={InviteClientEmail}
          meta={{ roles: ['agency', 'recruiter'] }}
        />
        <PrivateRoute
          path="/invite_all_client_email/:id"
          component={InviteAllClientEmail}
          meta={{ roles: ['agency', 'recruiter'] }}
        />
        <PrivateRoute
          path="/invite_assessment_email/:id"
          component={InviteAssessmentEmail}
          meta={{ roles: ['agency', 'recruiter'] }}
        />
        <PrivateRoute
          path="/edit-email-template/:id"
          component={EditEmailTemplate}
          meta={{ roles: ['agency', 'recruiter'] }}
        />
        <PrivateRoute
          path="/candidate-report/:candidateId/:jobId"
          component={CandidateReportPage}
          meta={{ roles: ['agency', 'recruiter'] }}
        />
        <PrivateRoute
          path="/notification-list"
          component={NotificationListPage}
          meta={{ roles: ['agency', 'recruiter'] }}
        />
        <Route component={NotFoundPage} />
      </Switch>
    </>
  );
}
