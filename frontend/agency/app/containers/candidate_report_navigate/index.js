import React, { memo, useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';
import messages from './messages';
import { FormattedMessage } from 'react-intl';
import globalMessages from 'messages';

import exportCandidateReportPdf, { clearExportPdfAction } from 'containers/common_provider/export_candidate_report_pdf/actions';
import {
  editCandidateInfoDetail,
  editCandidateInfoDetailDone,
  cleanUpEditCandidate,
  doSaveCandidateReportForm
} from 'containers/common_provider/candidate_state/edit_candidate_in_list/actions';
import { showModalRequest } from 'containers/common_provider/candidate_state/add_candidate_to_job/actions';
import {
  makeSelectExportCandidateReportPdfLoading,
  makeSelectExportCandidateReportPdfResponse,
  makeSelectExportCandidateReportPdfError,
} from 'containers/common_provider/export_candidate_report_pdf/selectors';
import {
  makeSelectEditCandidateResult,
  makeSelectEditCandidateLoad,
} from 'containers/common_provider/candidate_state/edit_candidate_in_list/selectors';
import {
  addCandidateToJob,
  setStatusAddFalse,
  addCandidateToJobThatUnSelected,
} from './actions';
import makeselectStateAddCandidateToJob, {
  makeSelectKeyAddCandidateToJob,
  makeSelectStatus,
} from './selectors';

import { openNotification } from 'utils/notification';
import { Row, Col, Modal, Button, notification } from 'antd';
import { PlusOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useFormikContext } from 'formik';
import ButtonCustom from 'components/atoms/Button';
import AddCandidateIntoJobTable from 'components/AddCandidateIntoJobTable';
import './styles.less';
import SpanCustom from 'components/SpanCustom';
import { ContentModal } from '../../components/modals/ContentModal';

const CandidateReportNavigate = props => {
  useInjectReducer({ key: 'addCandidateToJobPage', reducer });

  const { values, submitForm, setFieldValue } = useFormikContext();
  // const [tabPosition, SetTabPosition] = useState(null);
  const {
    history,
    candidateInfo,
    jobId,
    jobType,
    candidateId,
    editCandidateInfoDetail,
    editCandidateInfoDetailDone,
    cleanUpEditCandidate,
    addCandidateToJob,
    statusAdd,
    setStatusAddFalse,
    keyAddCandidateToJob,
    addCandidateToJobThatUnSelected,
    exportCandidateReportPdf,
    exportCandidateReportPdfLoading,
    exportCandidateReportPdfResponse,
    exportCandidateReportPdfError,
    clearExportPdfAction,
    showModalRequest,
    tabNumber,
    doSaveCandidateReportForm
  } = props;

  notification.config({
    duration: 1,
  });

  const styleModule = {
    display: 'block',
    width: '900px',
    height: 'auto',
  };

  const handleSubmit = () => {
    doSaveCandidateReportForm({ state: true, isGoBack: false});

  };

  const handleDone = () => {
    doSaveCandidateReportForm({ state: true, isGoBack: true, url: `/job-dashboard/${jobId}`});
  };

  const exportToPdf = () => {
    const params = {
      candidate_id: [candidateInfo?.id || candidateId],
      job_id: jobId
    };
    Modal.confirm({
      title: false,
      icon: false,
      centered: true,
      className: 'nem-modal-confirm',
      content: (
        <ContentModal
          title={<FormattedMessage {...messages.exportConfirmTitle} />}
          message={<FormattedMessage {...messages.exportConfirmMessage} />}
        />
      ),
      okText: <FormattedMessage {...messages.buttonYes} />,
      cancelButtonProps: { className: 'modal-btn-cancel' },
      onOk() {
        exportCandidateReportPdf(params);
      },
    });
  };

  // const showModal = () => {
  //   showModalRequest();
  // };

  useEffect(() => {
    if (candidateInfo) {
      setFieldValue(
        'additionalInfos',
        candidateInfo?.additional_infos?.length > 0
          ? candidateInfo.additional_infos
          : values?.additionalInfos,
      );
      if(candidateInfo.hasOwnProperty('include_assessment_report')){
        setFieldValue(
          'candidateAssessmentReports',
          candidateInfo?.include_assessment_report,
        );
      }else{
        setFieldValue(
          'candidateAssessmentReports',
          true,
        );
      }

      setFieldValue(
        'summaries',
        candidateInfo?.summaries?.length > 0
          ? candidateInfo.summaries
          : values?.summaries,
      );
      setFieldValue('candidateEmail', candidateInfo?.candidate_email);
      setFieldValue('backgroundCmt', candidateInfo?.background_comment);
      setFieldValue('backgroundCheck', candidateInfo?.background_check);
      setFieldValue('rightToWork', candidateInfo?.right_to_work);
      setFieldValue('rightToWorkCmt', candidateInfo?.right_to_work_comment);
      if(candidateInfo?.recruiter_assessments?.wheels && candidateInfo?.recruiter_assessments?.wheels.length > 0){
        setFieldValue(
          'competenceAssessmentWheels',
          candidateInfo?.recruiter_assessments
            ? candidateInfo?.recruiter_assessments
            : values?.competenceAssessmentWheels,
        );
      }

    } else {
      return;
    }
  }, [candidateInfo]);

  useEffect(() => {
    if (exportCandidateReportPdfResponse) {
      let url = window.URL.createObjectURL(
        exportCandidateReportPdfResponse?.data,
      );
      let a = document.createElement('a');
      a.href = url;
      a.download = exportCandidateReportPdfResponse?.fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      clearExportPdfAction();
    }
    return () => {};
  }, [exportCandidateReportPdfResponse]);

  return (
    <>
      <div className={`wrapper-candidate-navigate`}>
        <Row align="middle" justify={`space-between`}>
          <Col>
            <Row gutter={[8, 8]}>
              {/*<Button*/}
              {/*  onClick={() => showModal()}*/}
              {/*  className={`btn-primary-gradient`}*/}
              {/*  case="static"*/}
              {/*  type="primary"*/}
              {/*  icon={<PlusOutlined />}*/}
              {/*>*/}
              {/*  {<FormattedMessage {...messages.addCandidateToAnotherJob} />}*/}
              {/*</Button>*/}
            </Row>
          </Col>
          <Col>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonCustom
                  className={`btn-default-outline`}
                  case="static"
                  onClick={() =>
                    history.push({
                      pathname: `/candidate-report-preview/${candidateInfo?.id || candidateId}`,
                      state: {
                        jobId: jobId,
                        jobType: jobType
                      }
                    })
                  }
                >
                  <SpanCustom className={'action-icon'}>
                    <i className="fa fa-eye" aria-hidden="true" />
                  </SpanCustom>
                  {<FormattedMessage {...messages.preview} />}
                </ButtonCustom>
              </Col>
              <Col>
                <Button
                  type="default"
                  icon={<FilePdfOutlined />}
                  loading={exportCandidateReportPdfLoading}
                  onClick={exportToPdf}
                  className={'btn btn-default-outline'}
                >
                  <FormattedMessage {...messages.exportToPdf} />
                </Button>
              </Col>
              <Col>
                <Button
                  className={`btn btn-default-outline`}
                  style={{ display: 'flex', alignItems: 'center' }}
                  type="submit"
                  onClick={handleSubmit}
                >
                  <SpanCustom className={'action-icon'}>
                    <i className="far fa-save" aria-hidden="true" />
                  </SpanCustom>
                  {<FormattedMessage {...globalMessages.saveProgress} />}
                </Button>
              </Col>
              <Col>
                <ButtonCustom
                  className={`btn-primary-gradient`}
                  type="button"
                  onClick={handleDone}
                >
                  {<FormattedMessage {...globalMessages.done} />}
                </ButtonCustom>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  addCandidateToJobPage: makeselectStateAddCandidateToJob(),
  statusAdd: makeSelectStatus(),
  keyAddCandidateToJob: makeSelectKeyAddCandidateToJob(),
  exportCandidateReportPdfLoading: makeSelectExportCandidateReportPdfLoading(),
  exportCandidateReportPdfResponse: makeSelectExportCandidateReportPdfResponse(),
  exportCandidateReportPdfError: makeSelectExportCandidateReportPdfError(),
});

const mapDispatchToProps = {
  editCandidateInfoDetail,
  cleanUpEditCandidate,
  showModalRequest,
  exportCandidateReportPdf,
  editCandidateInfoDetailDone,
  clearExportPdfAction,
  doSaveCandidateReportForm
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CandidateReportNavigate);
