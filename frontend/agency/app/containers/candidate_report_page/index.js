/**
 *
 * CandidateReportPage
 *
 */

import React, { memo, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectCandidateReportPage from './selectors';
import makeSelectCandidateIdPage from './selectors';
import reducer from './reducer';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout';
import FormInfoDetail from 'components/FormInfoDetail';
import ButtonBack from 'components/ButtonBack';
import SpinnerLoading from 'components/SpinnerLoading';
import { Row, Col, Tabs, Modal } from 'antd';
import CandidateReportForm from 'containers/candidate_report_form';
import CandidateReportDocuments from 'containers/candidate_report_documents';
import CandidateReportEditProfile from 'containers/candidate_report_edit_profile';
import {
  getCandidateDetail,
  cleanUpCandidateDetail,
} from 'containers/common_provider/candidate_state/get_candidate_detail/actions';
import {
  makeSelectCandidateDetailLoading,
  makeSelectCandidateDetailResult,
} from 'containers/common_provider/candidate_state/get_candidate_detail/selectors';
import { makeSelectEditCandidateResult } from 'containers/common_provider/candidate_state/edit_candidate_in_list/selectors';
import {
  makeSelectVisibleModal,
  makeSelectLoading,
} from 'containers/common_provider/candidate_state/add_candidate_to_job/selectors';
import { cleanUpEditCandidate } from 'containers/common_provider/candidate_state/edit_candidate_in_list/actions';
import {
  closeModalRequest,
  addCandidateToJobRequest,
  clearStatusAddCandidateToJob,
} from 'containers/common_provider/candidate_state/add_candidate_to_job/actions';
import { passCandidateIdIntoStore } from './actions';
import { pushNotify } from 'utils/notify';
import {
  makeSelectInviteContactJobLoad,
  makeSelectInviteContactJobResult,
  makeSelectInviteError,
} from 'containers/common_provider/client_state/invite_contact_on_job/selectors';

import getAgencyInfoAction from '../common_provider/get_agency_info/actions';
import {
  makeSelectAgencyInfo,
  makeSelectGetAgencyInfoLoading,
} from '../common_provider/get_agency_info/selectors';

import './styles.less';
import { getUserInfo } from 'services/authentication';
const { TabPane } = Tabs;

import { CONFIG } from 'constants/config';
import AddCandidateIntoJobTable from 'components/AddCandidateIntoJobTable';
import {
  makeSelectError,
  makeSelectStatusAdd,
} from '../common_provider/candidate_state/add_candidate_to_job/selectors';
import { makeSelectSendEmailTemplateSuccess } from 'containers/invite_assessment_email/selectors';
const NOTIFICATION_TYPES = CONFIG.NOTIFICATION_TYPES;
import CombinedCustom from 'components/CombinedCustom';
import ButtonCustom from 'components/atoms/Button';
import {
  getJobDetail,
  cleanUpJobDetail,
} from 'containers/common_provider/create_job_state/get_job_detail/actions';
import {
  makeSelectJobDetail,
  makeSelectJobDetailLoading,
} from 'containers/job_dashboard/selectors';

export function CandidateReportPage(props) {
  useInjectReducer({ key: 'candidateReportPage', reducer });

  const {
    history,
    match,
    location,
    agencyInfo,
    agencyInfoLoading,
    jobDetail,
    getJobDetail,
    cleanUpJobDetail,
    getAgencyInfoAction,
    getCandidateDetail,
    cleanUpCandidateDetail,
    candidateDetaiLoad,
    candidateDetaiResult,
    candidateEditResult,
    cleanUpEditCandidate,
    addCandidateToJobRequest,
    candidate_Id,
    visibleModal,
    closeModalRequest,
    clearStatusAddCandidateToJob,
    loading,
    statusAdd,
    error,
    inviteContactJobResult,
  } = props;
  const handleGoBack = () => {
    if (!history || !jobId) return;
    history.push(`/job-dashboard/${jobId}`)
  };

  const userInfo = getUserInfo();
  const [list, setList] = useState([]);
  const [saveReportPopup, setSaveReportPopup] = useState(false);
  const [tabNumber, setTabNumber] = useState(1);
  const candidateId = useMemo(() => {
    return match?.params?.candidateId;
  }, [match]);

  const jobId = props.match.params.jobId;
  useEffect(() => {
    getAgencyInfoAction(userInfo.agency_id);
    getJobDetail(userInfo.agency_id, jobId)
    return () => {
      cleanUpEditCandidate();
      cleanUpJobDetail();
      cleanUpCandidateDetail();
    };
  }, []);

  function callback(key) {
    console.log(key);
    setTabNumber(key);
  }

  const handleCancel = () => {
    closeModalRequest();
  };

  const getList = data => {
    console.log('data', data);
    setList(data);
  };

  useEffect(() => {
    if (candidateEditResult?.success) {
      if (candidateEditResult?.done) {
        history.goBack();
      } else {
        setSaveReportPopup(true);
        // pushNotify({
        //   type: 'success',
        //   message: 'Edit Candidate profile success',
        // });
      }
    }
    return () => setSaveReportPopup(false);
  }, [candidateEditResult]);

  useEffect(() => {
    if (statusAdd) {
      pushNotify({ type: 'success', message: 'Add candidate to job success' });
    }
    setList([]);
    clearStatusAddCandidateToJob();
  }, [statusAdd]);

  useEffect(() => {
    if (visibleModal == false) {
      setList([]);
    }
  }, [visibleModal]);

  useEffect(() => {
    getCandidateDetail(candidateId, {
      params: {
        job_id: jobId
      },
    });
  }, [candidateId, candidateEditResult]);

  useEffect(() => {
    return () => {
      cleanUpEditCandidate();
      cleanUpCandidateDetail();
    };
  }, []);

  const assessmentLimit = useMemo(() => {
    return agencyInfo?.max_assessment_limit && true;
  }, [agencyInfo]);

  const addCandidateToJob = () => {
    if (list.length == 0) {
      pushNotify({
        type: 'warning',
        message: 'Please select one or more jobs',
      });
    } else {
      addCandidateToJobRequest(candidateId, {
        job_id_list: list,
      });
    }
  };
  return (
    <>
      {/* Modal ađ candiate to job  - no noel*/}
      <Modal
        title="Active Job List"
        visible={visibleModal}
        closable={false}
        onCancel={handleCancel}
        centered={true}
        width={900}
        onOk={addCandidateToJob}
        okText="Save"
        wrapClassName="addCandidateIntoJobModal"
        bodyStyle={{ paddingBottom: 8 }}
      >
        <AddCandidateIntoJobTable getValueSelectedRow={getList} />
      </Modal>

      <CombinedCustom
        width={600}
        toggleModal={saveReportPopup}
        title={`Saved`}
        content={`Your report has been saved.`}
        isSuccess={true}
        footer={[
          <Row gutter={[8, 0]}>
            <Col>
              <ButtonCustom
                type="primary"
                className="btn-primary-gradient btn-77-40"
                onClick={() => {
                  setSaveReportPopup(false);
                }}
              >
                {`Done`}
              </ButtonCustom>
            </Col>
          </Row>,
        ]}
      />
      <div>
        <Helmet>
          <title>Candidate Report</title>
          <meta
            name="description"
            content="Description of CandidateReportPage"
          />
        </Helmet>
        {candidateDetaiLoad && <SpinnerLoading loading={candidateDetaiLoad} />}
        <MainLayout {...history}>
          <ButtonBack onClick={handleGoBack} />
          <Row gutter={(8, 8)}>
            {/* Modal add candidate into job here */}

            <Col xs={24} md={24} lg={6} xxl={6}>
              <CandidateReportEditProfile
                candidateInfo={candidateDetaiResult}
                jobId={jobId}
                jobType={jobDetail?.work_type}
              />
            </Col>
            <Col xs={24} md={24} lg={18} xxl={18}>
              <Tabs className={`wrapper-tab`} onChange={callback} type="card">
                <TabPane
                  tab={
                    <span>
                      {' '}
                      <span className="action-icon">
                        <i className="fas fa-info" />
                      </span>
                      {`Report`}
                    </span>
                  }
                  key="1"
                >
                  <CandidateReportForm
                    tabNumber={tabNumber}
                    history={history}
                    candidateInfo={candidateDetaiResult}
                    jobId={jobId}
                    assessmentLimit={assessmentLimit}
                    handleGoBack={() => handleGoBack()}
                    jobType={jobDetail?.work_type}
                  />
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      {' '}
                      <span className="action-icon">
                        <i className="fas fa-file-alt" />
                      </span>
                      {`Document`}
                    </span>
                  }
                  key="2"
                >
                  <CandidateReportDocuments
                    candidateInfo={candidateDetaiResult}
                    tabNumber={tabNumber}
                    history={history}
                    jobId={jobId}
                    handleGoBack={() => handleGoBack()}
                    jobType={jobDetail?.work_type}
                  />
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </MainLayout>
        {/* <Formik>
          <CandidateReportNavigate />
        </Formik> */}
      </div>
    </>
  );
}

CandidateReportPage.propTypes = {
  getJobDetail: PropTypes.func.isRequired,
  cleanUpJobDetail: PropTypes.func.isRequired,
};
const mapStateToProps = createStructuredSelector({
  candidateReportPage: makeSelectCandidateReportPage(),
  candidateDetaiLoad: makeSelectCandidateDetailLoading(),
  candidateDetaiResult: makeSelectCandidateDetailResult(),
  candidateEditResult: makeSelectEditCandidateResult(),
  visibleModal: makeSelectVisibleModal(),
  loading: makeSelectLoading(),
  statusAdd: makeSelectStatusAdd(),
  error: makeSelectError(),
  inviteContactJobResult: makeSelectInviteContactJobResult(),
  agencyInfo: makeSelectAgencyInfo(),
  agencyInfoLoading: makeSelectGetAgencyInfoLoading(),
  jobDetail: makeSelectJobDetail(),
});

const mapDispatchToProps = {
  getJobDetail,
  cleanUpJobDetail,
  getCandidateDetail,
  cleanUpCandidateDetail,
  cleanUpEditCandidate,
  closeModalRequest,
  addCandidateToJobRequest,
  clearStatusAddCandidateToJob,
  getAgencyInfoAction,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CandidateReportPage);
