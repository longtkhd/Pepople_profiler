/**
 *
 * ClientDetailPage
 *
 */

import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectClientDetailPage, {
  makeSelectResultClientDetail,
  makeSelectClientDetaiLoading,
} from './selectors';
import reducer from './reducer';
import { fetchClientDetail, cleanClientDetail } from './actions';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout';
import ButtonBack from 'components/ButtonBack';
import ButtonCustom from 'components/atoms/Button';
import FormInfoDetail from 'components/FormInfoDetail';
import { Row, Col } from 'antd';
import InputEditCustom from 'components/InputEditCustom';
import { SelectEditCustom } from 'components/SelectCustom';
import ContactList from './ContactList';
import SpinnerLoading from 'components/SpinnerLoading';
import CheckEventForm from './CheckEventForm';
import {
  editClient,
  cleanUpEditClient,
} from 'containers/common_provider/client_state/edit_client/actions';
import {
  deleteClient,
  cleanUpDeleteClient,
} from 'containers/common_provider/client_state/delete_client/actions';
import { makeSelectDeleteClientResult } from 'containers/common_provider/client_state/delete_client/selectors';
import {
  makeSelectEditClientResult,
  makeSelectEditClientLoading,
} from 'containers/common_provider/client_state/edit_client/selectors';
import SelectIndustry from 'containers/reuse_component/SelectIndustry';

import { pushNotify } from 'utils/notify';
import CombinedCustom from 'components/CombinedCustom';
import { Form } from 'formik-antd';
import * as Yup from 'yup';
import './styles.less';
import { tokenDecoded } from 'utils/authHelper';

import loadOpenJobs from 'containers/common_provider/get_open_job/actions';
import loadClosedJobs from 'containers/common_provider/get_closed_job/actions';
import { makeSelectOpenJobsResponse } from 'containers/common_provider/get_open_job/selectors';
import { makeSelectClosedJobsResponse } from 'containers/common_provider/get_closed_job/selectors';
import {
  makeSelectChangeJobStatusError,
  makeSelectChangeJobStatusResponse,
} from 'containers/common_provider/change_job_status/selectors';
import OpenJob from 'components/shared/OpenJob';
import ClosedJob from 'components/shared/ClosedJob';
import { getUserInfo } from 'services/authentication';
import { openNotification } from 'utils/notification';

const schema = Yup.object().shape({
  businessName: Yup.string()
    // .trim('Please remove whitespace')
    // .strict(true)
    .min(2, 'Too short')
    .required('Please enter Business Name'),
});
export function ClientDetailPage(props) {
  useInjectReducer({ key: 'clientDetailPage', reducer });
  const {
    history,
    match,
    fetchClientDetail,
    cleanClientDetail,
    clientResult,
    clientDetaiLoad,
    deleteClient,
    deleteClientResult,
    editClient,
    editClientResult,
    cleanUpDeleteClient,
    cleanUpEditClient,
    openJobResponse,
    closedJobResponse,
    changeJobStatusError,
    getOpenJobs,
    getClosedJobs,
    changeJobStatusResponse,
  } = props;

  const [openJobs, setOpenJobs] = useState([]);
  const [closedJobs, setClosedJobs] = useState([]);
  const [totalOpenJob, setTotalOpenJob] = useState(null);
  const [totalClosedJob, setTotalClosedJob] = useState(null);
  const [openJobPage, setOpenJobPage] = useState(1);
  const [openJobsize, setOpenJobSize] = useState(10);
  const [closedJobPage, setClosedJobPage] = useState(1);
  const [closedJobsize, setClosedJobSize] = useState(10);

  const userInfo = getUserInfo();
  const clientId = useMemo(() => {
    return match?.params?.clientId;
  }, [match]);

  const handleGetOpenJob = (PageSize, currenPage) => {
    const { agency_id } = userInfo;
    const params = {
      client_id: clientId,
      status: [1, 2, 3, 4],
      page: currenPage || openJobPage,
      size: PageSize || openJobsize,
    };
    getOpenJobs(agency_id, params);
    if (currenPage) setOpenJobPage(currenPage);
    if (PageSize) setOpenJobSize(PageSize);
  };

  const handleSearchOpenJob = (keyword, current, pageSizes) => {
    const { agency_id } = userInfo;
    const params = {
      client_id: clientId,
      status: [1, 2, 3, 4],
      page: current || openJobPage,
      size: pageSizes || openJobsize,
      keyword: keyword,
    };
    getOpenJobs(agency_id, params);
    if (current) setOpenJobPage(current);
    if (pageSizes) setOpenJobSize(pageSizes);
  };

  const handleGetClosedJob = (PageSize, currenPage) => {
    const { agency_id } = userInfo;
    const params = {
      client_id: clientId,
      status: [6],
      page: currenPage || closedJobPage,
      size: PageSize || closedJobsize,
    };
    getClosedJobs(agency_id, params);
    if (currenPage) setClosedJobPage(currenPage);
    if (PageSize) setClosedJobSize(PageSize);
  };

  const handleSearchCloseJob = (keyword, current) => {
    const { agency_id } = userInfo;
    const params = {
      client_id: clientId,
      status: [6],
      page: current || closedJobPage,
      size: pageSizes || closedJobsize,
      keyword: keyword,
    };
    getClosedJobs(agency_id, params);
    if (current) setClosedJobPage(current);
    if (pageSizes) setClosedJobSize(pageSizes);
  };

  useEffect(() => {
    if (openJobResponse?.success) {
      const total = openJobResponse?.data?.total || null;
      if (total) {
        setTotalOpenJob(total);
      }
      const jobList = openJobResponse.data?.job_list || [];
      setOpenJobs(
        jobList.map(job => {
          job.key = job.id;
          return job;
        }),
      );
    }
    return () => {};
  }, [openJobResponse]);

  useEffect(() => {
    if (closedJobResponse?.success) {
      const total = closedJobResponse?.data?.total || null;
      if (total) {
        setTotalClosedJob(total);
      }
      const jobList = closedJobResponse.data?.job_list || [];
      setClosedJobs(
        jobList.map(job => {
          job.key = job.id;
          return job;
        }),
      );
    }
    return () => {};
  }, [closedJobResponse]);

  useEffect(() => {
    if (changeJobStatusResponse?.success) {
      openNotification(
        'success',
        <FormattedMessage {...messages.changeJobStatusSuccess} />,
      );
      handleGetOpenJob();
      handleGetClosedJob();
    }
    return () => {};
  }, [changeJobStatusResponse]);

  const infoAuth = useMemo(() => {
    return tokenDecoded('token') ? tokenDecoded('token') : null;
  }, [tokenDecoded]);

  const [editToggle, setEditToggle] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);

  const showModal = () => setToggleModal(true);
  const onCancel = () => setToggleModal(false);
  const onOk = () => handleDeleteClient(clientId);
  const toggleEdit = () => {
    setEditToggle(prev => !prev);
  };

  const onCancelEditing = () => {
    setEditToggle(prev => !prev);
  };

  useEffect(() => {
    handleGetOpenJob();
    handleGetClosedJob();
  }, [infoAuth]);

  useEffect(() => {
    return () => {
      cleanClientDetail();
      cleanUpDeleteClient();
      cleanUpEditClient();
    };
  }, []);

  useEffect(() => {
    clientId && fetchClientDetail(clientId);

    return () => cleanClientDetail();
  }, [clientId, editClientResult, deleteClientResult]);

  useEffect(() => {
    if (deleteClientResult?.success) {
      history.goBack();
      pushNotify({
        type: 'success',
        message: `Delete Client success`,
      });
      onCancel();
      cleanUpDeleteClient();
    }
  }, [deleteClientResult]);

  useEffect(() => {
    if (editClientResult?.success) {
      setEditToggle(prev => !prev);
      pushNotify({
        type: 'success',
        message: `Edit Client Information success`,
      });
      cleanUpEditClient();
    }
  }, [editClientResult]);

  const handleDeleteClient = clientId => deleteClient(clientId);

  const handleSaveEdit = useCallback(
    async (values, actions) => {
      const { businessName, industry } = values;
      const payload = {
        id: clientId,
        business_name: businessName,
        industry,
      };
      editClient(clientId, payload);
    },
    [clientId],
  );

  if (clientResult?.success === false) {
    history.push('/404');
  }

  const PopupMsg = () => (
    <>
      {/* POPUP  DELETE CLIENT */}
      <CombinedCustom
        width={500}
        toggleModal={toggleModal}
        title={`Are you sure?`}
        content={`Are you sure you want to permanently delete this client?`}
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
              <ButtonCustom onClick={onOk} className={`btn-danger w-120`}>
                {`Delete`}
              </ButtonCustom>
            </Col>
          </Row>,
        ]}
      />
    </>
  );

  return (
    <div>
      <Helmet>
        <title>Client Details</title>
        <meta name="description" content="Description of ClientDetailPage" />
      </Helmet>
      <MainLayout>
        {clientDetaiLoad && <SpinnerLoading loading={clientDetaiLoad} />}
        <ButtonBack history={history} />
        {PopupMsg()}
        <FormInfoDetail
          title={<FormattedMessage {...messages.clientInfo} />}
          actions={
            <Row className="action-group" gutter={[8, 8]} key={`edit_client`}>
              <Col>
                {!editToggle ? (
                  <ButtonCustom
                    case="static"
                    className="btn-danger btn-delete"
                    onClick={showModal}
                  >
                    <i className="action-icon far fa-trash-alt icon-btn" />
                    <FormattedMessage {...messages.delete} />
                  </ButtonCustom>
                ) : (
                  <ButtonCustom
                    case="static"
                    className="btn-danger btn-cancel"
                    onClick={onCancelEditing}
                  >
                    <FormattedMessage {...messages.cancel} />
                  </ButtonCustom>
                )}
              </Col>
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
            </Row>
          }
          case="use-form"
          initialValues={{ businessName: '', industry: '' }}
          validationSchema={schema}
          onSubmit={handleSaveEdit}
        >
          <div className="form-layout ">
            <Row gutter={[16, 8]}>
              <Col>
                <Form.Item
                  name="businessName"
                  hasFeedback={editToggle ? true : false}
                  showValidateSuccess={editToggle ? true : false}
                  className={`wrapper-group-input-ant`}
                >
                  <InputEditCustom
                    starIcon={false}
                    infostyles={'client__info'}
                    label={'Business Name'}
                    name="businessName"
                    type="text"
                    info={clientResult?.data?.business_name}
                    toggleedit={editToggle ? 'true' : false}
                  />
                </Form.Item>
              </Col>
              <Col>
                {editToggle ? (
                  <div style={{ width: '169px' }}>
                    <SelectIndustry label={'Industry'} name="industry" />
                  </div>
                ) : (
                  <SelectEditCustom
                    starIcon={false}
                    label={'Industry'}
                    name="industry"
                    type="text"
                    info={clientResult?.data?.industry}
                    infostyles={'client__info'}
                  />
                )}
              </Col>
            </Row>
            <CheckEventForm />
          </div>
        </FormInfoDetail>
        {/* contact */}
        <ContactList clientId={clientId} />
        <div className="mb-50">
          <OpenJob
            history={history}
            editable={false}
            dataSource={openJobs}
            totals={totalOpenJob}
            onAssignRecruiterSuccess={handleGetOpenJob}
            handleGetPanigationData={(a, b) => handleGetOpenJob(a, b)}
            title={<FormattedMessage {...messages.openJob} />}
            handleSearch={(keyword, current, pageSizes) =>
              handleSearchOpenJob(keyword, current, pageSizes)
            }
          />
        </div>
        <div className="mb-50">
          <ClosedJob
            history={history}
            editable={false}
            dataSource={closedJobs}
            totals={totalClosedJob}
            handleGetPanigationData={(a, b) => handleGetClosedJob(a, b)}
            title={<FormattedMessage {...messages.closedJob} />}
            handleSearch={(keyword, current, pageSizes) =>
              handleSearchCloseJob(keyword, current, pageSizes)
            }
          />
        </div>
      </MainLayout>
    </div>
  );
}

ClientDetailPage.propTypes = {
  fetchClientDetail: PropTypes.func.isRequired,
  cleanClientDetail: PropTypes.func.isRequired,
  deleteClient: PropTypes.func.isRequired,
  cleanUpDeleteClient: PropTypes.func.isRequired,
  editClient: PropTypes.func.isRequired,
  cleanUpEditClient: PropTypes.func.isRequired,
  openJobResponse: PropTypes.object,
  closedJobResponse: PropTypes.object,
  changeJobStatusError: PropTypes.object,
  changeJobStatusResponse: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  clientDetailPage: makeSelectClientDetailPage(),
  clientResult: makeSelectResultClientDetail(),
  clientDetaiLoad: makeSelectClientDetaiLoading(),
  deleteClientResult: makeSelectDeleteClientResult(),
  editClientResult: makeSelectEditClientResult(),
  editClientLoad: makeSelectEditClientLoading(),
  openJobResponse: makeSelectOpenJobsResponse(),
  closedJobResponse: makeSelectClosedJobsResponse(),
  changeJobStatusError: makeSelectChangeJobStatusError(),
  changeJobStatusResponse: makeSelectChangeJobStatusResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    cleanClientDetail: () => dispatch(cleanClientDetail()),
    cleanUpDeleteClient: () => dispatch(cleanUpDeleteClient()),
    cleanUpEditClient: () => dispatch(cleanUpEditClient()),
    deleteClient: clientId => dispatch(deleteClient(clientId)),
    fetchClientDetail: clientId => dispatch(fetchClientDetail(clientId)),
    editClient: (clientId, payload) => dispatch(editClient(clientId, payload)),
    getOpenJobs: (agencyId, params) =>
      dispatch(loadOpenJobs({ agencyId, params })),
    getClosedJobs: (agencyId, params) =>
      dispatch(loadClosedJobs({ agencyId, params })),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ClientDetailPage);
