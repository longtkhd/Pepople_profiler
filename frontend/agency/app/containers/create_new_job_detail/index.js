/**
 *
 * CreateNewJobDetail
 *
 */

import React, { memo, useEffect, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import CombinedCustom from 'components/CombinedCustom';
import Button from 'components/atoms/Button';
import { compose } from 'redux';
import { makeSelectStatusParseCv } from '../common_provider/candidate_state/upload_cv/selectors';

import {
  stepCreateJob,
  getAsyncCandidates,
  receiveExistCandidate,
  errorExistCandidate,
  addExistCandidate,
  deleteExistCandidate,
  cleanStepCreateJob,
} from './actions';

import {
  getJobDetail,
  cleanUpJobDetail,
} from 'containers/common_provider/create_job_state/get_job_detail/actions';
import {
  deleteJob,
  cleanDeleteJob,
} from 'containers/common_provider/create_job_state/delete_job/actions';

import {
  editJob,
  cleanEditJob,
} from 'containers/common_provider/create_job_state/edit_job/actions';

import {
  makeSelectDeleteJobLoading,
  makeSelectDeleteJobResult,
} from 'containers/common_provider/create_job_state/delete_job/selectors';

import {
  makeSelectEditJobResult,
  makeSelectEditJobLoading,
} from 'containers/common_provider/create_job_state/edit_job/selectors';

import { makeSelectCancellingUpload } from 'containers/common_provider/candidate_state/upload_cv/selectors';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectCreateNewJobDetail, {
  makeSelectJobDetail,
  makeSelectJobDetailLoading,
} from './selectors';

import reducer from './reducer';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout';
import FormInfoDetail from 'components/FormInfoDetail/loadable';
import ButtonCustom from 'components/atoms/Button';
import { Row, Col } from 'antd';
import InputEditCustom from 'components/InputEditCustom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import ButtonStep from './ButtonStep';
import SpinnerLoading from 'components/SpinnerLoading';
import CheckEventForm from './CheckEventForm';
import { tokenDecoded } from 'utils/authHelper';
import { SelectEditCustom } from 'components/SelectCustom';
import ButtonBack from 'components/ButtonBack';
import PopConfirmCustom from 'components/PopConfirmCustom';
import { pushNotify } from 'utils/notify';
import {
  cleanUploadCandidate,
  clearCancelUpload,
  cleanUploadCVCandidate,
} from 'containers/common_provider/candidate_state/upload_cv/actions';
import { cleanUpAddExistCandidate } from 'containers/common_provider/candidate_state/add_candidate_to_list/actions';
import { Form } from 'formik-antd';
import * as Yup from 'yup';
import './styles.less';

const renderStep = propsInfoJob => {
  switch (propsInfoJob?.step) {
    case 1:
      return <StepOne {...propsInfoJob} />;
    case 2:
      return <StepTwo {...propsInfoJob} />;
    case 3:
      return <StepThree {...propsInfoJob} />;
    default:
      return <StepOne />;
  }
};

const validation = Yup.object({
  jobTitle: Yup.string()
    // .trim('Please remove the whitespace')
    // .strict(true)
    .max(30, 'Must be 30 characters or less')
    .required('Required'),
  jobType: Yup.string()
    .trim()
    .required('Required'),
});
export function CreateNewJobDetail(props) {
  useInjectReducer({ key: 'createNewJobDetail', reducer });
  const {
    history,
    match,
    createNewJobDetail,
    stepCreateJob,
    getJobDetail,
    jobDetail,
    loadJobDetail,
    deleteJob,
    cleanDeleteJob,
    deleteJobResult,
    editJob,
    cleanEditJob,
    editJobResult,
    editJobLoad,
    cleanUpJobDetail,
    cleanStepCreateJob,
    cleanUploadCandidate,
    isCalledUpload,
    clearCancelUpload,
    cleanUploadCVCandidate,
    cleanUpAddExistCandidate,
    location,
    statusParseCv,
  } = props;
  const { step, candidates, loading } = createNewJobDetail;

  const [editToggle, setEditToggle] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [toggleModalParseCv, setToggleModalParseCv] = useState(false);
  const [jobType, setJobType] = useState("");

  const jobId = useMemo(() => {
    return match?.params?.jobId;
  }, [match?.params?.jobId]);

  const infoAuth = useMemo(() => {
    return tokenDecoded('token') ? tokenDecoded('token') : null;
  }, [tokenDecoded]);

  const propsInfoJob = {
    step,
    jobid: jobId,
  };

  const options = [
    {
      value: 'Permanent',
      label: 'Permanent / FTC',
    },
    {
      value: 'Contract',
      label: 'Executive Search',
    },
    {
      value: 'Temp',
      label: 'Temp',
    },
  ];

  const showModal = () => {
    setToggleModal(true);
  };

  const toggleEdit = () => {
    setEditToggle(prev => !prev);
  };

  const onDeleteJob = useCallback(() => {
    deleteJob(jobId);
    false;
  }, [jobId]);

  const onCancel = () => {
    setToggleModal(false);
  };
  const onCancelEditJob = () => {
    toggleEdit();
  };

  const handleSaveEdit = useCallback(
    async (values, actions) => {
      const { jobTitle, jobType } = values;
      const payload = {
        job_title: jobTitle,
        work_type: jobType,
      };
      editJob(jobId, payload);
    },
    [jobId],
  );

  useEffect(() => {
    if (isCalledUpload) {
      window.location.reload(isCalledUpload);
    }
    return () => clearCancelUpload();
  }, [isCalledUpload]);

  useEffect(() => {
    getJobDetail(infoAuth?.agency_id, jobId);
    showlabelJob()
  }, [infoAuth, jobId, editJobResult, deleteJobResult]);
 
   useEffect(() => {
    showlabelJob()
   }, [jobDetail]);
  
  const showlabelJob = () => {
    if (jobDetail?.work_type === "Permanent") setJobType("Permanent / FTC")
    else if (jobDetail?.work_type === "Contract") setJobType("Executive Search")
    else if (jobDetail?.work_type === "Temp") setJobType("Temp")
    else setJobType("...")
  }

  useEffect(() => {
    if (deleteJobResult?.success) {
      pushNotify({
        type: 'success',
        message: 'Delete job success!',
      });
      history.goBack();
    }
  }, [deleteJobResult]);

  useEffect(() => {
    if (statusParseCv) {
      setToggleModalParseCv(true);
    }
  }, [statusParseCv]);

  useEffect(() => {
    if (editJobResult?.success) {
      toggleEdit();
      pushNotify({
        type: 'success',
        message: `Edit job success!`,
      });
      cleanEditJob();
    }
  }, [editJobResult]);

  useEffect(() => {
    return () => {
      cleanDeleteJob();
      cleanEditJob();
      cleanUpJobDetail();
      cleanStepCreateJob();
      cleanUploadCandidate();
      cleanUploadCVCandidate();
      cleanUpAddExistCandidate();
    };
  }, []);

  return (
    <div>
      <CombinedCustom
        width={500}
        toggleModal={toggleModal}
        title={`Are you sure?`}
        content={`Do you want to delete this job?`}
        footer={[
          <Row gutter={[8, 0]}>
            <Col>
              <ButtonCustom
                onClick={onCancel}
                className={`btn-default-outline w-120`}
              >
                {`Cancel`}
              </ButtonCustom>
            </Col>
            <Col>
              <ButtonCustom
                onClick={onDeleteJob}
                className={`btn-danger w-120`}
              >
                {`Delete Job`}
              </ButtonCustom>
            </Col>
          </Row>,
        ]}
      />
      <CombinedCustom
        width={600}
        toggleModal={toggleModalParseCv}
        title={`Total Monthly CV Parsing Usage Exceeded!`}
        content={`Please be mindful that your agency has reached your monthly CV parsing limit. Upgrade to the next tier level to increase your limit.`}
        footer={[
          <Row gutter={[8, 0]}>
            <Col>
              <Button
                type="primary"
                className="btn-primary-gradient"
                onClick={() => {
                  setToggleModalParseCv(false);
                }}
              >
                {`OK`}
              </Button>
            </Col>
          </Row>,
        ]}
      />
      <Helmet>
        <title>Create New Job</title>
        <meta name="description" content="Description of CreateNewJobDetail" />
      </Helmet>
      {loadJobDetail && <SpinnerLoading loading={loadJobDetail} />}
      <MainLayout>
        <ButtonBack history={history} />
        <FormInfoDetail
          title={<FormattedMessage {...messages.createNew} />}
          actions={
            <Row className="action-group" gutter={[8, 8]}>
              <Col>
                {!editToggle ? (
                  <ButtonCustom
                    case="static"
                    className="btn-default-outline btn-edit"
                    onClick={toggleEdit}
                  >
                    <i className="icon-btn action-icon fas fa-edit" />
                    <FormattedMessage {...messages.edit} />
                  </ButtonCustom>
                ) : (
                  <ButtonCustom
                    type="submit"
                    className="btn-primary-gradient btn-save"
                  >
                    <FormattedMessage {...messages.save} />
                  </ButtonCustom>
                )}
              </Col>
              <Col>
                {!editToggle ? (
                  <ButtonCustom
                    case="static"
                    className="btn-danger btn-delete"
                    onClick={() => {
                      showModal();
                    }}
                  >
                    <i className="action-icon far fa-trash-alt" />
                    <FormattedMessage {...messages.delete} />
                  </ButtonCustom>
                ) : (
                  <ButtonCustom
                    case="static"
                    className="btn-danger btn-cancel"
                    onClick={onCancelEditJob}
                  >
                    <FormattedMessage {...messages.cancel} />
                  </ButtonCustom>
                )}
              </Col>
            </Row>
          }
          case="use-form"
          initialValues={{
            jobTitle: jobDetail?.job_title ? jobDetail?.job_title : '',
            jobType: jobDetail?.work_type ? jobType : '',
          }}
          validationSchema={validation}
          onSubmit={handleSaveEdit}
        >
          <div className="form-layout">
            <Row gutter={[16, 8]}>
              <Col>
                <InputEditCustom
                  starIcon={false}
                  label={'Business Name:'}
                  name="businessName"
                  type="text"
                  info={jobDetail?.business_name}
                  toggleedit={false}
                  className="label-job"
                />
              </Col>
              <Col>
                <Form.Item name="jobTitle">
                  <InputEditCustom
                    starIcon={false}
                    label={'Position Being Recruited:'}
                    name="jobTitle"
                    type="text"
                    info={jobDetail?.job_title}
                    className="label-job"
                    toggleedit={editToggle ? 'true' : false}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="jobType">
                  <SelectEditCustom
                    starIcon={false}
                    label={'Job Type:'}
                    id="jobType"
                    name="jobType"
                    info={jobType}
                    className="label-job"
                    toggleedit={editToggle ? 'true' : false}
                    options={options}
                  />
                </Form.Item>
              </Col>
            </Row>
            <CheckEventForm />
          </div>
        </FormInfoDetail>
        <FormInfoDetail title={'Add shortlisted candidates resumes'}>
          {renderStep(propsInfoJob)}
        </FormInfoDetail>
        <ButtonStep
          stepCreateJob={stepCreateJob}
          step={propsInfoJob.step}
          jobId={propsInfoJob.jobid}
        />
      </MainLayout>
    </div>
  );
}

CreateNewJobDetail.propTypes = {
  stepCreateJob: PropTypes.func.isRequired,
  // getAsyncCandidates: PropTypes.func.isRequired,
  // receiveExistCandidate: PropTypes.func.isRequired,
  errorExistCandidate: PropTypes.func.isRequired,
  getJobDetail: PropTypes.func.isRequired,
  deleteJob: PropTypes.func.isRequired,
  cleanDeleteJob: PropTypes.func.isRequired,
  createNewJobDetail: PropTypes.any,
  editJob: PropTypes.func.isRequired,
  cleanEditJob: PropTypes.func.isRequired,
  cleanUpJobDetail: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  createNewJobDetail: makeSelectCreateNewJobDetail(),
  jobDetail: makeSelectJobDetail(),
  loadJobDetail: makeSelectJobDetailLoading(),
  deleteJobLoad: makeSelectDeleteJobLoading(),
  deleteJobResult: makeSelectDeleteJobResult(),
  editJobResult: makeSelectEditJobResult(),
  editJobLoad: makeSelectEditJobLoading(),
  isCalledUpload: makeSelectCancellingUpload(),
  statusParseCv: makeSelectStatusParseCv(),
});

const mapDispatchToProps = {
  stepCreateJob,
  errorExistCandidate,
  getJobDetail,
  deleteJob,
  cleanDeleteJob,
  editJob,
  cleanEditJob,
  cleanUpJobDetail,
  cleanStepCreateJob,
  cleanUploadCandidate,
  clearCancelUpload,
  cleanUploadCVCandidate,
  cleanUpAddExistCandidate,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CreateNewJobDetail);
