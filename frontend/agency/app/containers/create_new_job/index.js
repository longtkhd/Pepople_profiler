/**
 *
 * CreateNewJob
 *
 */

import React, { memo, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectCreateNewJob, {
  makeSelectClientState,
  makeSelectCreateResult,
  makeSelectCreateLoading,
} from './selectors';
import reducer from './reducer';

import { fetchClientList } from 'containers/common_provider/client_state/actions';
import { createJob, cleanUp } from 'containers/common_provider/create_job_state/actions';
import { editJob, cleanEditJob } from 'containers/common_provider/create_job_state/edit_job/actions';
import { makeSelectEditJobResult } from 'containers/common_provider/create_job_state/edit_job/selectors';
import { makeSelectContactListDetail, makeSelectContactListDetailLoad } from 'containers/common_provider/client_state/selectors';

import messages from './messages';
import { Row, Col } from 'antd';
import InputCustom from 'components/InputCustom';
import SelectCustom from 'components/SelectCustom';
import AutoCompleteCustom from 'components/AutoCompleteCustom';
import FormInfoDetail from 'components/FormInfoDetail';
import * as Yup from 'yup';
import ButtonCustom from 'components/atoms/Button';
import { push } from 'connected-react-router';
import CheckEventForm from './CheckEventForm';
import SpinnerLoading from 'components/SpinnerLoading';
import { openNotification } from 'utils/notification';
import { getUserInfo } from 'services/authentication';

import { Formik } from 'formik';
import { Form } from 'formik-antd';
import './styles.less';
export function CreateNewJob(props) {
  useInjectReducer({ key: 'createNewJob', reducer });

  const {
    fetchClientList,
    client,
    contactList,
    push,
    cleanUp,
    createJob,
    resultCreate,
    loadingCreate,
    toggleEdit,
    onToggleEdit,
    jobDetail,
    editJob,
    cleanEditJob,
    editResult,
  } = props;
  const userInfo = getUserInfo();

  const { loading, clientData } = client;
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [ctList, setCtList] = useState([]);
  const userEmail = userInfo.email

  const defaultJobType = [
    {
      value: 'Permanent',
      label: 'Permanent / FTC',
    },
    {
      value: 'Temp',
      label: 'Temp',
    },
  ];
  const recruiteJobType = [
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
  const [listJobType, setListJobType] = useState(defaultJobType);

  let initValue = {
    businessName: '',
    email: '',
    jobTitle: '',
    contactFirstName: '',
    contactLastName: '',
    contactNumber: '',
    clientId: '',
    clientContactId: '',
    jobType: '',
  };

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  let validation = Yup.object({
    businessName: Yup.string()
      .required('Please enter Business Name'),
    jobTitle: Yup.string()
      .max(80, 'Must be 80 characters or less')
      .required('Please enter Position Being Recruited'),
    contactFirstName: Yup.string()
      .required('Please enter Contact First Name'),
    contactLastName: Yup.string()
      .required('Please enter Contact Last Name'),
    contactNumber: Yup.string()
      .matches(phoneRegExp, 'Phone Number is not valid')
      .required('Please enter Contact Number'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Please enter Email'),
    jobType: Yup.string()
      .required('Please enter Job Type'),
  });

  if (toggleEdit) {
    initValue = {
      jobTitle: jobDetail?.job_title ? jobDetail.job_title : '',
      jobType: jobDetail?.work_type ? jobDetail.work_type : '',
    };
    validation = Yup.object({
      jobTitle: Yup.string()
        .max(80, 'Must be 80 characters or less')
        .required('Please enter Position Being Recruited'),
      jobType: Yup.string()
        .required('Please enter Job Type'),
    });
  }

  const businessListName = useMemo(() => {
    return (
      clientData?.data?.client_list.map(({ id, business_name }) => ({
        key: id,
        id,
        value: business_name?.charAt(0).toUpperCase() + business_name?.slice(1),
      })) || []
    );
  }, [clientData, loading]);

  const clientContacts = useMemo(() => {
    return (
      ctList?.map(({ id, first_name, client_id, email, last_name, contract_number, }) => ({
        key: id,
        id,
        client_id,
        email,
        last_name,
        contract_number,
        value: first_name ? first_name.charAt(0).toUpperCase() + first_name.slice(1) : '',
      }))
    );
  }, [ctList]);
  const onFinish = values => {
    const {
      businessName,
      contactFirstName,
      contactLastName,
      contactNumber,
      email,
      jobTitle,
      jobType,
      clientId,
      clientContactId,
    } = values;
    
    let payload = {
      business_name: businessName,
      contact_email: email,
      contact_number: contactNumber,
      job_title: jobTitle,
      first_name: contactFirstName?.label || contactFirstName,
      last_name: contactLastName,
      work_type: jobType,
      client_id: clientId,
      client_contact_id: clientContactId,
    };

    if (toggleEdit) {
      payload = {
        job_title: jobTitle,
        work_type: jobType,
      };
      editJob(jobDetail?.id, payload);
    } else {
      createJob(userInfo?.agency_id, payload);
    }
  };

  const checkEmailRecruite = s => s.includes('@') && s.substr(s.lastIndexOf('@') + 1).split(' ')[0]
  const onCheckEmailRecruite = () => {
    let result = checkEmailRecruite(userEmail)
    if (result === 'troocoo.com') setListJobType(recruiteJobType)
    else setListJobType(defaultJobType)
  }

  const onSelectClient = (value, client) => {
    setSelectedClient(client);
  }

  const onChangeClient = value => {
    setSelectedClient(null);
    setSelectedContact(null);
    setCtList([]);
  }

  const onSelectContact = (value, contact) => {
    setSelectedContact(contact);
  }

  const onChangeContact = value => {
    setSelectedContact(null);
  }

  useEffect(() => {
    if (contactList) {
      setCtList(contactList);
    }
    return () => { }
  }, [contactList])

  useEffect(() => {
    if (resultCreate?.success) {
      push(`/create-new-job/${resultCreate?.data?.id}`);
      openNotification('success', <FormattedMessage {...messages.createJobSuccess} />)
      cleanUp();
    }
  }, [resultCreate?.success]);

  useEffect(() => {
    if (editResult?.success) {
      openNotification('success', <FormattedMessage {...messages.editJobSuccess} />)
      cleanEditJob();
    }
  }, [editResult, toggleEdit]);

  useEffect(() => {
    onCheckEmailRecruite()
    if (userInfo?.agency_id) {
      fetchClientList(userInfo.agency_id, {
        params: {
          paginate: false,
        },
      });
    }
    return () => {
      cleanUp();
      cleanEditJob();
    };
  }, []);

  return (
    <>
      {loadingCreate && <SpinnerLoading loading={loadingCreate} />}
      <Formik
        enableReinitialize={true}
        initialValues={initValue}
        validationSchema={validation}
        onSubmit={onFinish}
      >
        {({ values }) => (
          <Form>
            <FormInfoDetail
              title={
                toggleEdit ? (
                  <FormattedMessage {...messages.jobInfo} />
                ) : (
                  <FormattedMessage {...messages.createNew} />
                )
              }
              actions={
                <Row gutter={[8, 8]}>
                  {toggleEdit ? (
                    <>
                      <Col>
                        <ButtonCustom
                          case="static"
                          onClick={onToggleEdit}
                          className={`btn-danger`}
                        >
                          <FormattedMessage {...messages.cancel} />
                        </ButtonCustom>
                      </Col>
                      <Col>
                        <ButtonCustom
                          type={`submit`}
                          className={`btn-primary-gradient`}
                        >
                          <FormattedMessage {...messages.save} />
                        </ButtonCustom>
                      </Col>
                    </>
                  ) : (
                    <Col>
                      <ButtonCustom
                        type={`submit`}
                        className={`btn-primary-gradient`}
                      >
                        <FormattedMessage {...messages.create} />
                      </ButtonCustom>
                    </Col>
                  )}
                </Row>
              }
            >
              <Row
                justify={toggleEdit ? 'flex-start' : 'space-between'}
                align="middle"
                gutter={[
                  { xs: 8, sm: 16, md: 24, lg: 32 },
                  { xs: 8, sm: 16, md: 24, lg: 32 },
                ]}
              >
                <Col xs={24} sm={12} md={12} lg={8}>
                  <Form.Item
                    name="jobTitle"
                    hasFeedback={true}
                    showValidateSuccess={true}
                    className={`wrapper-group-input-ant`}
                  >
                    <InputCustom
                      label="Position Being Recruited"
                      name="jobTitle"
                      type="text"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={8}>
                  <Form.Item
                    name="jobType"
                    hasFeedback={true}
                    showValidateSuccess={true}
                    className={`wrapper-group-input-ant`}
                  >
                    <SelectCustom
                      label="Job Type"
                      id="jobType"
                      name="jobType"
                      type="text"
                      options={listJobType}
                    />
                  </Form.Item>
                </Col>
                {!toggleEdit && (
                  <Col xs={24} sm={12} md={12} lg={8}>
                    <Form.Item
                      name="businessName"
                      hasFeedback={true}
                      showValidateSuccess={true}
                      className={`wrapper-group-input-ant`}
                    >
                      <AutoCompleteCustom
                        label="Client's Business Name"
                        id="businessName"
                        name="businessName"
                        type="text"
                        onSelect={onSelectClient}
                        onChange={onChangeClient}
                        options={businessListName}
                        filterOption={(inputValue, option) => {
                          return (
                            option.value
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) !== -1
                          );
                        }}
                      />
                    </Form.Item>
                  </Col>
                )}
                {!toggleEdit && (
                  <Col xs={24} sm={12} md={12} lg={4}>
                    <Form.Item
                      name="contactFirstName"
                      hasFeedback={true}
                      showValidateSuccess={true}
                      className={`wrapper-group-input-ant`}
                    >
                      <AutoCompleteCustom
                        label="Client's First Name"
                        id="contactFirstName"
                        name="contactFirstName"
                        type="text"
                        onSelect={onSelectContact}
                        onChange={onChangeContact}
                        options={clientContacts}
                        filterOption={(inputValue, option) => {
                          return (
                            option.value
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) !== -1
                          );
                        }}
                      />
                    </Form.Item>
                  </Col>
                )}
                {!toggleEdit && (
                  <Col xs={24} sm={12} md={12} lg={4}>
                    <Form.Item
                      name="contactLastName"
                      hasFeedback={true}
                      showValidateSuccess={true}
                      className={`wrapper-group-input-ant`}
                    >
                      <InputCustom label="Client's Last Name" name="contactLastName" />
                    </Form.Item>
                  </Col>
                )}
                {!toggleEdit && (
                  <Col xs={24} sm={12} md={12} lg={8}>
                    <Form.Item
                      name="email"
                      hasFeedback={true}
                      showValidateSuccess={true}
                      className={`wrapper-group-input-ant`}
                    >
                      <InputCustom label="Client's Email" name="email" type="email" />
                    </Form.Item>
                  </Col>
                )}
                {!toggleEdit && (
                  <Col xs={24} sm={12} md={12} lg={8}>
                    <Form.Item
                      name="contactNumber"
                      hasFeedback={true}
                      showValidateSuccess={true}
                      className={`wrapper-group-input-ant`}
                    >
                      <InputCustom
                        label="Clients Phone Number"
                        name="contactNumber"
                        type="text"
                      />
                    </Form.Item>
                  </Col>
                )}
              </Row>
              <CheckEventForm selectedClient={selectedClient} selectedContact={selectedContact} />
            </FormInfoDetail>
          </Form>
        )}
      </Formik>
    </>
  );
}

CreateNewJob.propTypes = {
  push: PropTypes.func,
  fetchClientList: PropTypes.func.isRequired,
  createJob: PropTypes.func.isRequired,
  cleanUp: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  createNewJob: makeSelectCreateNewJob(),
  client: makeSelectClientState(),
  contactList: makeSelectContactListDetail(),
  resultCreate: makeSelectCreateResult(),
  loadingCreate: makeSelectCreateLoading(),
  editResult: makeSelectEditJobResult(),
  contactDetailLoad: makeSelectContactListDetailLoad(),
});

const mapDispatchToProps = {
  push,
  fetchClientList,
  createJob,
  cleanUp,
  editJob,
  cleanEditJob,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CreateNewJob);
