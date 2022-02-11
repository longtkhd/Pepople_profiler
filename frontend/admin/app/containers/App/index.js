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
import DashboardPage from 'containers/dashboard_page/loadable';
import ArgencyPage from 'containers/admin_agency_list/loadable'
import NotFoundPage from 'containers/not_found_page/loadable';
import AdminAgencyDetails from 'containers/admin_agency_details/loadable';
import AdminAssessment from 'containers/admin_assessment/loadable';
import CreateAssessmentIndustry from 'containers/create_assessment_industry/loadable';
import EditAssessmentIndustry from 'containers/edit_assessment_industry/loadable'
import AdminUserDetails from 'containers/admin_user_details/loadable'
import AdminUserList from 'containers/admin_user_list/loadable';
import ProjectAssessment from 'containers/project_assessment/loadable'
import CreateProjectAssessment from 'containers/create_project_assessment/loadable';
import EditProjectAssessment from 'containers/edit_project_assessment/loadable'
import AdminAssessmentType from 'containers/admin_assessment_type/loadable'
import CreateAssessmentType from 'containers/create_assessment_type/loadable'
import EditAssessmentType from 'containers/edit_assessment_type/loadable'
import PaymentHistoryInfo from 'containers/payment_history_info/loadable'
import AdminRecruiterList from 'containers/admin_recruiter_list/loadable'
import AdminMyAccount from 'containers/admin_my_account/loadable'
import ForgotPassword from 'containers/forgot_password/loadable'
import ResetPassword from 'containers/reset_password/loadable'

export default function App() {
  return (
    <>
      <Switch>
        <Route path="/admin/login" component={LoginPage} />
        <Route path="/forgot-password" component={ForgotPassword}   meta={{ roles: ['admin'] }} />
        <Route path="/reset-password" component={ResetPassword} />
        <PrivateRoute
          exact
          path="/"
          meta={{ roles: ['admin'] }}
        />

        <PrivateRoute
          path="/dashboard-page"
          component={DashboardPage}
          meta={{ roles: ['admin'] }}
        />
        <PrivateRoute
          path="/admin-agency-list"
          component={ArgencyPage}
          meta={{ roles: ['admin'] }}
        />
        <PrivateRoute
          path="/admin-agency-detail/:id"
          component={AdminAgencyDetails}
          meta={{ roles: ['admin'] }}
        />

        <PrivateRoute
          path="/admin-assessment"
          component={AdminAssessment}
          meta={{ roles: ['admin'] }}
        />
        <PrivateRoute
          path="/new-assessment-industry"
          component={CreateAssessmentIndustry}
          meta={{ roles: ['admin'] }}
        />
        <PrivateRoute
          path="/edit-assessment-industry/:id"
          component={EditAssessmentIndustry}
          meta={{ roles: ['admin'] }}
        />
        <PrivateRoute
          path="/recruiter-detail/:id"
          component={AdminUserDetails}
          meta={{ roles: ['admin'] }}
        />

        <PrivateRoute
          path="/recruiter-list/:id"
          component={AdminRecruiterList}
          meta={{ roles: ['admin'] }}
        />
        <PrivateRoute
          path="/admin-assessment-type"
          component={AdminAssessmentType}
          meta={{ roles: ['admin'] }}
        />
        <PrivateRoute
          path="/edit-assessment-type/:id"
          component={EditAssessmentType}
          meta={{ roles: ['admin'] }}
        />

        <PrivateRoute
          path="/new-assessment-type"
          component={CreateAssessmentType}
          meta={{ roles: ['admin'] }}
        />
        <PrivateRoute
          path="/project-assessment"
          component={ProjectAssessment}
          meta={{ roles: ['admin'] }}
        />
        <PrivateRoute
          path="/new-project-assessment"
          component={CreateProjectAssessment}
          meta={{ roles: ['admin'] }}
        />

        <PrivateRoute
          path="/edit-project-assessment/:id"
          component={EditProjectAssessment}
          meta={{ roles: ['admin'] }}
        />
        <PrivateRoute
          path="/payment-history/:id"
          component={PaymentHistoryInfo}
          meta={{ roles: ['admin'] }}
        />
        <PrivateRoute
          path="/my-account"
          component={AdminMyAccount}
          meta={{ roles: ['admin'] }}
        />

       
      
        <Route component={NotFoundPage} />
      </Switch>
    </>
  );
}
