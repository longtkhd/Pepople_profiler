/**
 *
 * CandidateReportPreview
 *
 */

import React, { memo, useEffect, useState, useMemo } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';

import {
  getCandidateDetail,
} from 'containers/common_provider/candidate_state/get_candidate_detail/actions';

import {
  makeSelectCandidateDetailLoading,
  makeSelectCandidateDetailResult,
  makeSelectCandidateDetailError
} from 'containers/common_provider/candidate_state/get_candidate_detail/selectors';

import CandidateMainReport from 'components/layout/CandidateMainReport';
import CandidateReportLayout from 'components/layout/CandidateReportLayout';
import SpinnerLoading from 'components/SpinnerLoading';

import './styles.less';
import {
  makeSelectDownloadDocumentSuccess,
  makeSelectDownloadDocumentLoading,
  makeSelectDownloadDocumentError,
  makeSelectDownloadAssessmentLoading,
  makeSelectDownloadAssessmentError,
  makeSelectDownloadAssessmentSuccess
} from '../common_provider/candidate_state/candidate_document/selectors';
import {
  cleanAllStateDocument ,
  downloadDocumentsAction,
  downloadAssessmentReportAction
} from '../common_provider/candidate_state/candidate_document/actions';

import exportCandidatePdfAction, {
  clearExportPdfAction
} from '../common_provider/export_candidate_report_pdf/actions';
import {
  makeSelectExportCandidateReportPdfError,
  makeSelectExportCandidateReportPdfLoading,
  makeSelectExportCandidateReportPdfResponse
} from '../common_provider/export_candidate_report_pdf/selectors';

import getAgencyInfoAction, {
  getCompanyBackground,
  getCompanyLogo,
} from '../common_provider/get_agency_info/actions';

import {
  makeSelectGetAgencyInfoLoading,
  makeSelectGetAgencyInfoError,
  makeSelectAgencyInfo,
  makeSelectCompanyBackgroundSuccess,
  makeSelectCompanyLogoSuccess,
  makeSelectGetCompanyLogoLoading
} from '../common_provider/get_agency_info/selectors';

import { openNotification } from 'utils/notification';
import { tokenDecoded } from 'utils/authHelper';

export function CandidateReportPreview(props) {
  useInjectReducer({ key: 'candidateReportPreview', reducer });

  const {
    history,
    match,
    location,
    candidateLoading,
    candidateInfo,
    candidateError,
    onGetCandidateInfo,
    download,
    errorDownload,
    loadingDownload,
    onDownload,
    onAssessmentDownload,
    assessmentDownload,
    assessmentDownloadLoading,
    assessmentDownloadError,
    onClearDownload,
    onExportCandidatePdf,
    clearExportPdf,
    exportResponse,
    exportError,
    exportLoading,
    loadingAgency,
    getAgencyInfo,
    agencyInfoResponse,
    getCompanyLogoAction,
    companyLogo,
    loadingLogo
  } = props;


  const [isLoading, setIsLoading] = useState(false);
  const [candidateData, setCandidateData] = useState(candidateInfo)

  useEffect(() => {
    if (candidateInfo)
      setCandidateData(candidateInfo)
  }, [candidateInfo])

  const candidateId = useMemo(() => {
    return match?.params?.candidateId;
  }, [match?.params?.candidateId]);

  const jobType = useMemo(() => {
    return location?.state?.jobType;
  }, [location?.state?.jobType]);

  const jobId = useMemo(() => {
    return location?.state?.jobId;
  }, [location?.state?.jobId]);

  const handleDownloadDocument = doc => {
    if (!candidateInfo?.id) return;
    onDownload(candidateInfo?.id, doc);
  };

  const handleDownloadAssessment = (assessmentId) => {
    onAssessmentDownload(assessmentId);
  };

  const handleExportToPdf = (params) => {
    const data = { ...params, job_id: jobId}
    onExportCandidatePdf(data);
  }

  useEffect(() => {
    onGetCandidateInfo(candidateId, {
      params: {
        job_id: jobId
      }
    });
    return () => {
      onClearDownload();
      clearExportPdf();
    }
  }, []);

  /***/
  const infoAuth = useMemo(() => {
    return tokenDecoded('token') ? tokenDecoded('token') : null;
  }, [tokenDecoded]);

  useEffect(() => {
    const agencyId = infoAuth?.agency_id;
    if (agencyId) {
      getAgencyInfo(agencyId);
    }
  }, [infoAuth]);

  const contactInfo = useMemo(() => {
    return {contact_name: infoAuth?.firstname, email: ''}
  }, [infoAuth]);

  const fontColor = useMemo(() => {
    return agencyInfoResponse?.company_info?.font_color;
  }, [agencyInfoResponse]);
  
  useEffect(() => {
    if (agencyInfoResponse?.company_info?.logo) {
      getCompanyLogoAction(
        agencyInfoResponse.id,
        agencyInfoResponse.company_info.logo,
        'logo',
      );
    }
  }, [agencyInfoResponse?.company_info?.logo]);

  useEffect(() => {
    const isLoading = candidateLoading || loadingAgency || loadingLogo ||
      loadingDownload || assessmentDownloadLoading || exportLoading;
    setIsLoading(isLoading);
  }, [candidateLoading, assessmentDownloadLoading, loadingDownload, exportLoading, loadingAgency, loadingLogo]);

  useEffect(() => {
    if (download) {
      const fileURL = window.URL.createObjectURL(download?.data);
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', download?.fileName);
      document.body.appendChild(fileLink);
      fileLink.click();
    }
  }, [download]);

  useEffect(() => {
    if (assessmentDownload) {
      const fileURL = window.URL.createObjectURL(assessmentDownload?.data);
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', assessmentDownload?.fileName);
      document.body.appendChild(fileLink);
      fileLink.click();
    }
  }, [assessmentDownload]);

  useEffect(() => {
    if (exportResponse) {
      const fileURL = window.URL.createObjectURL(exportResponse?.data);
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', exportResponse?.fileName);
      document.body.appendChild(fileLink);
      fileLink.click();
      clearExportPdf();
    }
  }, [exportResponse]);

  useEffect(() => {
    if (exportError) {
      openNotification('error', exportError?.message || 'Export faild.');
    }
  }, [exportError]);

  useEffect(() => {
    const error = errorDownload || candidateError || assessmentDownloadError;
    if (error) {
      openNotification('error', error?.message || error || 'Action Faild!.');
    }
  }, [errorDownload, candidateError, assessmentDownloadError]);

  if (isLoading) return <SpinnerLoading loading={isLoading} />;

  return (
    <div>
      <Helmet>
        <title>Recruiter Candidate Report Preview</title>
        <meta name="description" content="Recruiter Candidate Report Preview" />
      </Helmet>
      <CandidateReportLayout history={history} userInfo={infoAuth} logo={companyLogo} color={fontColor}>
        <CandidateMainReport
          candidateInfo={candidateData}
          disableSubmit={true}
          jobType={jobType}
          onDownload={handleDownloadDocument}
          onDownloadAssessment={handleDownloadAssessment}
          onExport={handleExportToPdf}
          classNames={
            {
              buttonColor: '#3abcca',
              linkColor: '#3abcca',
              fontColor: '#32363e'
            }
          }
          contactInfo={contactInfo}
        />
      </CandidateReportLayout>
    </div>
  );
}

CandidateReportPreview.propTypes = {
  candidateLoading: PropTypes.bool,
  candidateInfo: PropTypes.object,
  candidateError: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  onGetCandidateInfo: PropTypes.func,
  download: PropTypes.object,
  errorDownload: PropTypes.object,
  loadingDownload: PropTypes.bool,
  onDownload: PropTypes.func,
  onClearDownload: PropTypes.func,
  exportResponse: PropTypes.object,
  exportError: PropTypes.object,
  exportLoading: PropTypes.bool,
  onExportCandidatePdf: PropTypes.func,
  clearExportPdf: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  candidateLoading: makeSelectCandidateDetailLoading(),
  candidateInfo: makeSelectCandidateDetailResult(),
  candidateError: makeSelectCandidateDetailError(),
  download: makeSelectDownloadDocumentSuccess(),
  loadingDownload: makeSelectDownloadDocumentLoading(),
  errorDownload: makeSelectDownloadDocumentError(),
  assessmentDownload: makeSelectDownloadAssessmentSuccess(),
  assessmentDownloadLoading: makeSelectDownloadAssessmentLoading(),
  assessmentDownloadError: makeSelectDownloadAssessmentError(),
  exportResponse: makeSelectExportCandidateReportPdfResponse(),
  exportError: makeSelectExportCandidateReportPdfError(),
  exportLoading: makeSelectExportCandidateReportPdfLoading(),
  agencyInfoResponse: makeSelectAgencyInfo(),
  errorAgency: makeSelectGetAgencyInfoError(),
  loadingAgency: makeSelectGetAgencyInfoLoading(),
  loadingLogo: makeSelectGetCompanyLogoLoading(),
  companyLogo: makeSelectCompanyLogoSuccess(),
  companyBackground: makeSelectCompanyBackgroundSuccess(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetCandidateInfo: (candidateId, params) =>
      dispatch(getCandidateDetail(candidateId, params)),
    onDownload: (candidateId, doc) => {
      dispatch(downloadDocumentsAction(candidateId, doc));
    },
    onAssessmentDownload: (assessmentId) => {
      dispatch(downloadAssessmentReportAction(assessmentId))
    },
    onClearDownload: () => dispatch(cleanAllStateDocument()),
    onExportCandidatePdf: (params) => dispatch(exportCandidatePdfAction(params)),
    clearExportPdf: () => dispatch(clearExportPdfAction()),
    getAgencyInfo: agencyId => dispatch(getAgencyInfoAction(agencyId)),
    getCompanyLogoAction: (agencyId, fileId, type) => {
      dispatch(getCompanyLogo(agencyId, fileId, type));
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CandidateReportPreview);
