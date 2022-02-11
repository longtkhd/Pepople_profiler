import React, { memo, useCallback, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import FormInfoDetail from 'components/FormInfoDetail/loadable';
import { Row, Col } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  MailOutlined,
} from '@ant-design/icons';
import Button from 'components/atoms/Button';
import ButtonCustom from 'components/atoms/Button';
import { Form, Formik } from 'formik';
import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';
import InputEditCustom from 'components/InputEditCustom';
import Status from 'components/Status';
import {
  changeStatusJob,
  cleanChangeStatusJob,
} from 'containers/common_provider/create_job_state/change_status_job/actions';
import { makeSelectChangeStatusJobResult } from 'containers/common_provider/create_job_state/change_status_job/selectors';
import { deleteJob } from 'containers/common_provider/create_job_state/delete_job/actions';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import CombinedCustom from 'components/CombinedCustom';
import PopConfirmCustom from 'components/PopConfirmCustom';

const JobInfo = props => {
  useInjectReducer({ key: 'clientListPage', reducer });
  const {
    jobDetail,
    jobDetailLoad,
    onToggleEdit,
    changeStatusJob,
    infoAuth,
    deleteJob,
    changeStatusJobResult,
  } = props;
  const [toggleModal, setToggleModal] = useState(false);
  const [toggleModalDelete, setToggleModalDelete] = useState(false);
  const [jobType, setJobType] = useState("");


  // console.log('jobDetailLoad',jobDetailLoad)
  // console.log('jobDetail',jobDetail);

  const showModal = () => {
    setToggleModal(true);
  };
  const showModalDelete = () => {
    setToggleModalDelete(true);
  };

  const onEdit = () => {
    onToggleEdit();
  };

  const onCloseJob = useCallback(() => {
    const payload = {
      status: 6,
      job_id: [jobDetail?.id],
    };
    changeStatusJob(infoAuth?.agency_id, payload);
  }, [jobDetail, infoAuth]);

  const onOpenJob = useCallback(() => {
    const payload = {
      status: 1,
      job_id: [jobDetail?.id],
    };
    changeStatusJob(infoAuth?.agency_id, payload);
  }, [jobDetail, infoAuth]);

  const onDeleteJob = useCallback(() => {
    deleteJob(jobDetail?.id);
    // alert(jobDetail.id);
  }, [jobDetail]);

  const onCancel = () => {
    setToggleModal(false);
  };
  const onCancelDelete = () => {
    setToggleModalDelete(false);
  };

  useEffect(() => {
    if (changeStatusJobResult?.success) {
      setToggleModal(false);
      setToggleModalDelete(false);
      cleanChangeStatusJob();
    }
  }, [changeStatusJobResult]);

   useEffect(() => {
    showlabelJob()
   }, [jobDetail]);
  
  const showlabelJob = () => {
    if (jobDetail?.work_type === "Permanent") setJobType("Permanent / FTC")
    else if (jobDetail?.work_type === "Contract") setJobType("Executive Search")
    else if (jobDetail?.work_type === "Temp") setJobType("Temp")
    else setJobType("...")
  }
  return (
    <>
      <CombinedCustom
        width={500}
        toggleModal={toggleModal}
        title={`Are you sure?`}
        content={`Do you want to close this job?`}
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
              {/* onClick={onOk} */}
              <ButtonCustom onClick={onCloseJob} className={`btn-danger w-120`}>
                {`Close Job`}
              </ButtonCustom>
            </Col>
          </Row>,
        ]}
      />
      <CombinedCustom
        width={500}
        toggleModal={toggleModalDelete}
        title={`Are you sure?`}
        content={`Do you want to delete this job?`}
        footer={[
          <Row gutter={[8, 0]}>
            <Col>
              <ButtonCustom
                onClick={onCancelDelete}
                className={`btn-default-outline w-120`}
              >
                {`Cancel`}
              </ButtonCustom>
            </Col>
            <Col>
              {/* onClick={onOk} */}
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
      <FormInfoDetail
        title={<FormattedMessage {...messages.jobInfo} />}
        actions={
          <Row className="action-group" gutter={[8, 8]}>
            <Col>
              <Button
                className="btn-danger"
                onClick={() => {
                  showModalDelete();
                }}
              >
               <i className="action-icon far fa-trash-alt" />
                <FormattedMessage {...messages.delete} />
              </Button>
            </Col>
            <Col>
              {jobDetail?.status === 1 ? (
                <Button
                  className="btn-secondary"
                  onClick={() => {
                    showModal();
                  }}
                >
                  <LockOutlined className="icon-btn" />
                  <FormattedMessage {...messages.closeJob} />
                </Button>
              ) : (
                <Button onClick={onOpenJob} className="btn-primary">
                  {/* <LockOutlined className="icon-btn" /> */}
                  <FormattedMessage {...messages.openJob} />
                </Button>
              )}
            </Col>
            <Col>
              <Button onClick={onEdit} className="btn-default-outline">
                <EditOutlined className="icon-btn" />
                <FormattedMessage {...messages.edit} />
              </Button>
            </Col>
          </Row>
        }
      >
        <Formik>
          <Form className="form">
            <div className="form-layout">
              <div className="form-layout-item">
                <InputEditCustom
                  label={'Business Name:'}
                  name="businessName"
                  type="text"
                  info={jobDetail?.business_name}
                  actived={`false`}
                />
              </div>
              {/* <div className="form-layout-item">
            <InputEditCustom
              label={'Client:'}
              name="client"
              type="text"
              info={'Roger Johnson'}
              actived={false}
            />
          </div>

          <div className="form-layout-item">
            <InputEditCustom
              label={'Email:'}
              name="email"
              type="email"
              info={'roger.johnson@gmail.com'}
              actived={false}
            />
          </div> */}

              {/* <div className="form-layout-item">
            <InputEditCustom
              label={'Contact Number:'}
              name="contactNumber"
              type="text"
              info={99887766}
              actived={false}
            />
          </div> */}
              <div className="form-layout-item">
                <InputEditCustom
                  label={'Position Being Recruited:'}
                  name="jobTitle"
                  type="text"
                  info={jobDetail?.job_title}
                  actived={`false`}
                />
              </div>
              <div className="form-layout-item">
                <InputEditCustom
                  label={'Job Type:'}
                  name="jobType"
                  type="text"
                  info={jobType}
                  actived={`false`}
                />
              </div>
              <div className="form-layout-item">
                <InputEditCustom
                  label={'Status:'}
                  name="jobType"
                  type="text"
                  info={<Status type={jobDetail?.display_status} />}
                  actived={`false`}
                />
              </div>
            </div>
          </Form>
        </Formik>
      </FormInfoDetail>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  changeStatusJobResult: makeSelectChangeStatusJobResult(),
});

const mapDispatchToProps = {
  changeStatusJob,
  deleteJob,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(JobInfo);
