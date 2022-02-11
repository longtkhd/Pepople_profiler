const TOKEN = 'token';

const WORK_TYPES = [
  { id: 1, name: 'Permanent' },
  { id: 2, name: 'Contract' },
  { id: 3, name: 'Temp' },
];

const REACHES = {
  ASSESSMENT_REACHES: 70,
  CV_PARSING_REACHES: 70
}

const NOTIFICATION_TYPES = {
  RECRUITER_INVITATION_ACCEPTED: 1,
  RECRUITER_REQUEST_TO_UPDATE_EMAIL: 2,
  RECRUITER_CHANGE_NAME: 3,
  PAYMENT_UNSUCCESSFUL: 4,
  ACCOUNT_IS_DEACTIVATED: 7,
  PEOPLE_PROFILER_PRODUCT_ENHANCEMENT: 8,
  COMPANY_ANNOUNCEMENT: 9,
  EMAIL_HAS_BEEN_UPDATED_BY_ADMIN: 10,
  CANDIDATE_HAS_STARTED_THE_ASSESSMENT: 11,
  CANDIDATE_HAS_COMPLETED_THE_ASSESSMENT: 12,
  CLIENT_HAS_VIEWD_CANDIDATE_REPORT: 13,
  CLIENT_PROVIDED_FEEDBACK_ON_CANDIDATE_REPORTS: 14,
  TALENT_ASSESSMENT: 16,
  CV_PARSING: 17,
  TALENT_ASSESSMENT_REACHES: 18,
  CV_PARSING_REACHES: 19,
}

const DEFAULT_AGENCY_NOTIFICATIONS_SETTINGS = [
  { type: NOTIFICATION_TYPES.RECRUITER_INVITATION_ACCEPTED, notify: 'Recruiter invitation accepted', by_website: true, by_email: false },
  { type: NOTIFICATION_TYPES.RECRUITER_REQUEST_TO_UPDATE_EMAIL, notify: 'Recruiter requests to update email address', by_website: true, by_email: true },
  { type: NOTIFICATION_TYPES.RECRUITER_CHANGE_NAME, notify: 'Recruiter changes name', by_website: true, by_email: false },
  { type: NOTIFICATION_TYPES.PAYMENT_UNSUCCESSFUL, notify: 'Payment unsuccessful', by_website: true, by_email: true },
  { type: NOTIFICATION_TYPES.ACCOUNT_IS_DEACTIVATED, notify: 'Account is deactivated', by_website: true, by_email: true },
  { type: NOTIFICATION_TYPES.TALENT_ASSESSMENT, notify: `Monthly talent assessment usage used up`, by_website: true, by_email: true },
  { type: NOTIFICATION_TYPES.TALENT_ASSESSMENT_REACHES, notify: `Monthly talent assessment usage reaches ${REACHES.ASSESSMENT_REACHES}%`, by_website: true, by_email: true },
  { type: NOTIFICATION_TYPES.CV_PARSING, notify: `Monthly CV parsing usage used up`, by_website: true, by_email: true },
  { type: NOTIFICATION_TYPES.CV_PARSING_REACHES, notify: `Monthly CV parsing reaches ${REACHES.CV_PARSING_REACHES}% usage`, by_website: true, by_email: true },
  { type: NOTIFICATION_TYPES.PEOPLE_PROFILER_PRODUCT_ENHANCEMENT, notify: 'People Profiler product enhancement', by_website: true, by_email: true },
  { type: NOTIFICATION_TYPES.COMPANY_ANNOUNCEMENT, notify: 'Company announcement', by_website: true, by_email: true },
]

const DEFAULT_RECRUITER_NOTIFICATIONS_SETTINGS = [
  { type: NOTIFICATION_TYPES.EMAIL_HAS_BEEN_UPDATED_BY_ADMIN, notify: 'Email has been updated by admin', by_website: true, by_email: true },
  { type: NOTIFICATION_TYPES.CANDIDATE_HAS_STARTED_THE_ASSESSMENT, notify: 'Candidate has started the assessment', by_website: true, by_email: true },
  { type: NOTIFICATION_TYPES.CANDIDATE_HAS_COMPLETED_THE_ASSESSMENT, notify: 'Candidate has completed the assessment', by_website: true, by_email: true },
  { type: NOTIFICATION_TYPES.CLIENT_HAS_VIEWD_CANDIDATE_REPORT, notify: 'Client has viewed candidate reports', by_website: true, by_email: true },
  { type: NOTIFICATION_TYPES.CLIENT_PROVIDED_FEEDBACK_ON_CANDIDATE_REPORTS, notify: 'Client provided feedback on candidate reports', by_website: true, by_email: true },
  { type: NOTIFICATION_TYPES.PEOPLE_PROFILER_PRODUCT_ENHANCEMENT, notify: 'People Profiler product enhancement', by_website: true, by_email: true },
  { type: NOTIFICATION_TYPES.COMPANY_ANNOUNCEMENT, notify: 'Company announcement', by_website: true, by_email: true },
];

const GST_TAX = 10;
const SERVER = process.env.API_URL || 'http://localhost:3000';

export const CONFIG = {
  TOKEN,
  SERVER,
  WORK_TYPES,
  NOTIFICATION_TYPES,
  DEFAULT_AGENCY_NOTIFICATIONS_SETTINGS,
  DEFAULT_RECRUITER_NOTIFICATIONS_SETTINGS,
  GST_TAX,
}

export const API_KEY = {
  COMMON_KEY: "/common",
  AUTH_KEY: "/auth",
  AGENCY_KEY: "/agency",
  USER_KEY: "/user",
  RECRUITER_KEY: "/recruiter",
  NOTIFICATION_KEY: "/notification",
  DELETE_NOTIFICATION: "deleteNotification",
  CLIENT: "/client",
  JOB_KEY: "/job",
  CANDIDATE_KEY: "/candidate",
  CLIENT_JOB_DASHBOARD_KEY: '/clientJobDasboard',
  MAIL_TEMPLATE_KEY: 'mailTemplate',
  RESEND_VERIFY_KEY: 'resendVerify'
}
