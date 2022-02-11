import React, {
  memo,
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import TableCustom from 'components/TableCustom';
import ActionType from 'components/TableCustom/ActionType';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Checkbox, Row, Col, Rate, Modal, Radio, Table } from 'antd';
import FormInfoDetail from 'components/FormInfoDetail';
import PopConfirmCustom from 'components/PopConfirmCustom';
import InputCustom from 'components/InputCustom';
import { PlusOutlined, MailOutlined, CommentOutlined } from '@ant-design/icons';
import ButtonCustom from 'components/atoms/Button';
import ModalCustom from 'components/ModalCustom';

import { AutoComplete } from 'formik-antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDollar, faComments, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getAvailableContactJob,
  cleanAvailableJob,
} from 'containers/common_provider/create_job_state/get_contact_for_job/actions';
import {
  getContactInJob,
  cleanContactInJob,
} from 'containers/common_provider/create_job_state/get_contact_in_job/actions';
import {
  addMoreContactToJob,
  cleanAddMoreContact,
} from 'containers/common_provider/client_state/add_more_contact_to_job/actions';
import {
  inviteContactOnJob,
  inviteAllAction,
  cleanInviteContact,
} from 'containers/common_provider/client_state/invite_contact_on_job/actions';
import {
  makeSelectClientContactInJobState,
  makeSelectClientContactInJobStateLoad,
} from 'containers/common_provider/create_job_state/get_contact_in_job/selectors';
import {
  makeSelectClientContactJobtate,
  makeSelectClientContactJobtateLoad,
} from 'containers/common_provider/create_job_state/get_contact_for_job/selectors';
import {
  makeSelectAddMoreContactToJobLoad,
  makeSelectAddMoreContactToJobResult,
} from 'containers/common_provider/client_state/add_more_contact_to_job/selectors';
import {
  makeSelectInviteContactJobLoad,
  makeSelectInviteContactJobResult,
  makeSelectInviteError,
} from 'containers/common_provider/client_state/invite_contact_on_job/selectors';
import {
  deleteContactInJob,
  cleanDeleteContactJob,
} from 'containers/common_provider/create_job_state/delete_client_in_job/actions';
import {
  makeSelectDeleteContactJobLoading,
  makeSelectDeleteContactJobResult,
} from 'containers/common_provider/create_job_state/delete_client_in_job/selectors';
import {
  makeSelectClientFeedbackSuccess,
  makeSelectClientFeedbackLoading,
} from 'containers/common_provider/client_state/get_client_feedback/selectors';
import {
  getClientFeedbackAction,
  clearClientFeedbackAction,
} from 'containers/common_provider/client_state/get_client_feedback/actions';
import {
  makeSelectRevokedLoading,
  makeSelectRevokedSuccess,
  makeSelectRevokedError,
} from 'containers/common_provider/client_state/revoke_contact_on_job/selectors';
import {
  revokeClientAction,
  revokeAllAction,
  clearRevoked,
} from 'containers/common_provider/client_state/revoke_contact_on_job/actions';

import {
  makeSelectShortlistedCandidateJobResult,
} from 'containers/common_provider/candidate_state/get_shortlisted_candidate_job/selectors';

import {
  getShortlistedCandidate,
} from 'containers/common_provider/candidate_state/get_shortlisted_candidate_job/actions';

import { tokenDecoded } from 'utils/authHelper';
import { pushNotify } from 'utils/notify';
import { openNotification } from 'utils/notification';

import { ContentModal } from '../../components/modals/ContentModal';
import './styles/client-list.less';
import { FieldArray, Formik } from 'formik';
import * as Yup from 'yup';
import { Form } from 'formik-antd';
import * as clientService from 'services/api/clientService';
import * as jobService from 'services/api/jobService';
import moment from 'moment';
import InterviewModal from './InterviewModal';

const initValueAddContact = {
  contactList: [
    {
      first_name: '',
      last_name: '',
      email: '',
      contact_number: '',
      id: '',
    },
    {
      first_name: '',
      last_name: '',
      email: '',
      contact_number: '',
      id: '',
    },
  ],
};

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = Yup.object().shape({
  contactList: Yup.array().of(
    Yup.object().shape({
      first_name: Yup.string()
        .min(2, 'Too short')
        .required('Please enter first name'),
      last_name: Yup.string()
        .min(2, 'Too short')
        .required('Please enter last name'),
      contact_number: Yup.string()
        .matches(phoneRegExp, 'Phone number is not valid')
        .min(2, 'Too short')
        .required('Please enter Contact Number'),
      email: Yup.string()
        .email('Email is not valid')
        .required('Please enter Email'),
    }),
  ),
});

const ClientList = props => {
  const {
    history,
    match,
    jobDetail,
    getAvailableContactJob,
    getContactInJob,
    cleanContactInJob,
    cleanAvailableJob,
    addMoreContactLoad,
    clientContactJobs,
    clientContactInJob,
    clientContactInJobLoad,
    addMoreContactResult,
    cleanInviteContact,
    inviteContactJobLoad,
    inviteContactJobResult,
    invitedError,
    deleteContactInJob,
    cleanDeleteContactJob,
    deleteContactJobResult,
    deleteContactJobLoad,
    addMoreContactToJob,
    cleanAddMoreContact,
    clientFeedbackLoad,
    clientFeedbackResult,
    getClientFeedbackAction,
    clearClientFeedbackAction,
    revokeClientAction,
    revokeAllAction,
    revoked,
    revokedLoading,
    revokedError,
    clearRevoked,
    getShortlistedCandidate,
    shortlistedCandidateResult
  } = props;

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(undefined);
  const [toggleInterviewModal, setToggleInterviewModal] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [toggleFeedback, setToggleModalFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);

  const handleChangeFirstName = (data, setFieldValue) => {
    const { option, i } = data;
    if (option) {
      setFieldValue(`contactList[${i}].last_name`, option.last_name);
      setFieldValue(`contactList[${i}].email`, option.email);
      setFieldValue(`contactList[${i}].contact_number`, option.contact_number);
      setFieldValue(`contactList[${i}].client_id`, option.client_id);
      setFieldValue(`contactList[${i}].id`, option.id);

      handleChangeContacts(option);
    }
  };

  const handleChangeContacts = (contact, isPush = false) => {
    const lstContact = [...contacts, { ...contact, value: contact.first_name }];
    if (isPush) {
      setContacts(lstContact);
      return;
    }
    const newContacts = contacts.filter(c => {
      return c.id !== contact.id;
    });
    if (newContacts) setContacts(newContacts);
    return;
  };

  const infoAuth = useMemo(() => {
    return tokenDecoded('token') ? tokenDecoded('token') : null;
  }, [tokenDecoded]);

  const jobId = useMemo(() => {
    return match?.params?.jobId;
  }, [match?.params?.jobId]);

  const contactListInJobs = useMemo(() => {

    return (
      clientContactInJob &&
      clientContactInJob.map(contacts => ({
        key: contacts?.client_contact_id,
        ...contacts,
      }))
    );
  }, [clientContactInJob, toggleInterviewModal]);

  const shortlistedCandidateList = useMemo(() => {
    return (
      shortlistedCandidateResult &&
      shortlistedCandidateResult.map(candidate => ({
        id: candidate?.id,
        key: candidate?.id,
        name: candidate?.candidate_name,
        status: candidate?.assessment_status || 'notinvitedyet',
        email: candidate?.candidate_email,
        position: candidate?.current_position,
        employer: candidate?.current_employer,
        exp: candidate?.exp_rem,
        notice: candidate?.notice_period,
      }))
    );
  }, [shortlistedCandidateResult]);

  useEffect(() => {
    if (jobDetail?.id) {
      getShortlistedCandidate(jobDetail?.id);
    }
  }, [jobDetail])

  useEffect(() => {
    if (clientContactJobs) {
      const listContacts = clientContactJobs.map(client => ({
        id: client?.id,
        first_name: client.first_name,
        last_name: client.last_name,
        contact_number: client.contract_number,
        email: client.email,
        value: client.first_name,
      }));
      setContacts(listContacts);
    }
  }, [clientContactJobs]);

  
  useEffect(() => {
    return () => {
      cleanContactInJob();
      cleanInviteContact();
      cleanDeleteContactJob();
      clearRevoked();
    };
  }, []);

  useEffect(() => {
    if (inviteContactJobResult || inviteContactJobResult?.success) {
      openNotification(
        'success',
        <FormattedMessage {...messages.clientInvitedSuccess} />,
      );
    }
  }, [inviteContactJobResult]);

  useEffect(() => {
    if (deleteContactJobResult?.success) {
      pushNotify({
        type: 'success',
        message: 'Delete a contact success',
      });
    }
  }, [deleteContactJobResult]);

  useEffect(() => {
    if (addMoreContactResult?.success) {
      pushNotify({
        type: 'success',
        message: 'Add contact to job success',
      });
    }
  }, [addMoreContactResult]);

  useEffect(() => {
    if (jobDetail?.id) {
      getContactInJob(infoAuth?.agency_id, jobDetail?.id);
    }
  }, [
    jobDetail,
    infoAuth,
    addMoreContactResult,
    inviteContactJobResult,
    deleteContactJobResult,
    toggleInterviewModal,
    revoked,
  ]);

  useEffect(() => {
    if (toggleModal) {
      getAvailableContactJob(infoAuth?.agency_id, jobDetail?.id);
    }
    return () => {
      cleanAvailableJob();
      cleanAddMoreContact();
    };
  }, [jobDetail, toggleModal, infoAuth]);


  const showModal = () => {
    setToggleModal(true);
  };

  const showInterviewModal = () => {
    setToggleInterviewModal(true);
  };

  const handleDeleteClientContact = useCallback(
    contactId => {
      deleteContactInJob(jobDetail?.id, contactId);
    },
    [jobDetail],
  );

  const handleCancel = e => {
    setToggleModal(false);
    formRef.current?.resetForm();
  };

  const handleInterviewCancel = e => {
    setToggleInterviewModal(false);
  };

  const handleSubmit = () => {
    formRef.current?.handleSubmit();
  };

  const handleInterviewSubmit = async (values) => {
    const payload = [];
    for (const [key, value] of Object.entries(values)) {
      if (!key.includes("info-")) {
        payload.push({
          candidate_id: key,
          time_id: value,
          info: values[`info-${key}`]
        });
      }
    }
  
// console.log(payload, values)
    try {
      await clientService.addTimeInterview(jobId, selectedContact.client_contact_id, payload);
    } catch (err) {
      console.log(err);
    } finally {
      setToggleInterviewModal(false);
    }
  };

  const onFinish = async values => {
    const payload = {
      client_contact_list: values?.contactList,
    };
    await addMoreContactToJob(jobDetail?.id, payload);
    formRef.current?.resetForm();
    setToggleModal(false);
  };

  /** LOGIC INVITE, REVOKE */

  const isInvitedAll = useMemo(() => {
    if (contactListInJobs) {
      return contactListInJobs.every(item => {
        return item?.is_invite;
      });
    }
    return false;
  }, [contactListInJobs]);

  const contactIds = useMemo(() => {
    if (clientContactInJob && clientContactInJob.length > 0) {
      const listIds = clientContactInJob.map(
        contact => contact?.client_contact_id,
      );
      return { client_contact_list: listIds };
    }
    return false;
  }, [clientContactInJob]);

  const handleConfirmInviteAll = () => {
    Modal.confirm({
      title: false,
      icon: false,
      centered: true,
      className: 'nem-modal-confirm',
      content: (
        <ContentModal
          title={<FormattedMessage {...messages.modalInviteTitle} />}
          message={<FormattedMessage {...messages.modalInviteAll} />}
        />
      ),
      okText: <FormattedMessage {...messages.yes} />,
      cancelText: <FormattedMessage {...messages.cancel} />,
      cancelButtonProps: { className: 'modal-btn-cancel' },
      onOk() {
        localStorage.setItem(
          'dataInviteAll',
          JSON.stringify({
            jobId: jobId,
            listContacts: contactIds,
          }),
        );
        history.push(`/invite_all_client_email/${jobId}`);
      },
    });
  };

  const handleConfirmInvite = (contactId, record) => {
    Modal.confirm({
      title: false,
      icon: false,
      centered: true,
      className: 'nem-modal-confirm',
      content: (
        <ContentModal
          title={<FormattedMessage {...messages.modalInviteTitle} />}
          message={<FormattedMessage {...messages.modalInvite} />}
        />
      ),
      okText: <FormattedMessage {...messages.yes} />,
      cancelText: <FormattedMessage {...messages.cancel} />,
      cancelButtonProps: { className: 'modal-btn-cancel' },
      onOk() {
        localStorage.setItem(
          'dataInvite',
          JSON.stringify({
            contact_first_name: record?.first_name,
            contact_last_name: record?.last_name,
            contact_id: record?.client_contact_id,
            jobId: jobId,
          }),
        );
        history.push({
          pathname: `/invite_client_email/${jobDetail?.id}`,
        });
      },
    });
  };

  const handleConfirmRevoke = contactId => {
    Modal.confirm({
      title: false,
      icon: false,
      centered: true,
      className: 'nem-modal-confirm',
      content: (
        <ContentModal
          title={<FormattedMessage {...messages.modalRevokeTitle} />}
          message={<FormattedMessage {...messages.modalRevoke} />}
        />
      ),
      okText: <FormattedMessage {...messages.buttonRevoke} />,
      cancelText: <FormattedMessage {...messages.cancel} />,
      cancelButtonProps: { className: 'modal-btn-cancel' },
      onOk() {
        if (!jobDetail?.id) return;
        revokeClientAction(contactId, jobDetail?.id);
      },
    });
  };

  const handleConfirmRevokeAll = () => {
    Modal.confirm({
      title: false,
      icon: false,
      centered: true,
      className: 'nem-modal-confirm',
      content: (
        <ContentModal
          title={<FormattedMessage {...messages.modalRevokeTitle} />}
          message={<FormattedMessage {...messages.modalRevokeAll} />}
        />
      ),
      okText: <FormattedMessage {...messages.buttonRevoke} />,
      cancelText: <FormattedMessage {...messages.cancel} />,
      cancelButtonProps: { className: 'modal-btn-cancel' },
      onOk() {
        if (!jobDetail?.id || !contactIds) return;
        revokeAllAction(jobDetail?.id, contactIds);
      },
    });
  };

  useEffect(() => {
    if (revoked?.success) {
      openNotification(
        'success',
        <FormattedMessage {...messages.revokeContactSuccess} />,
      );
      clearRevoked();
    }
  }, [revoked]);

  useEffect(() => {
    const error = revokedError || invitedError;
    if (error) {
      openNotification('error', error?.message);
    }
  }, [revokedError, invitedError]);

  /** END */

  /** LOGIC FEEDBACK */

  const showModelFeedback = () => {
    setToggleModalFeedback(true);
  };

  const handleClose = e => {
    clearClientFeedbackAction();
    setToggleModalFeedback(false);
  };

  const handleOpenFeedback = useCallback(
    (contactId, hasFeedback) => {
      if (!hasFeedback) return;
      getClientFeedbackAction(jobDetail?.id, contactId);
    },
    [jobDetail],
  );

  useEffect(() => {
    if (clientFeedbackResult) {
      setToggleModalFeedback(true);
    }
  }, [clientFeedbackResult]);

  /** END */

  useEffect(() => {
    const loading =
      clientContactInJobLoad ||
      inviteContactJobLoad ||
      deleteContactJobLoad ||
      revokedLoading ||
      addMoreContactLoad ||
      clientFeedbackLoad;
    setIsLoading(loading);
  }, [
    clientContactInJobLoad,
    addMoreContactLoad,
    inviteContactJobLoad,
    deleteContactJobLoad,
    revokedLoading,
    clientFeedbackLoad,
  ]);
  const columnFeedbacks = [
    {
      title: 'Candidate Name',
      dataIndex: 'candidate_name',
      key: 'candidate_name',
      width: '150px',
    },
    {
      title: 'Feedback from email',
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => {
        return (
          <p
            style={{
              whiteSpace: 'break-spaces',
              margin: '0',
              wordBreak: 'break-word',
            }}
          >
            {record?.email}
          </p>
        );
      },
    },
    {
      title: 'Feedback',
      dataIndex: 'feedback',
      key: 'feedback',
      width: '300px',
      render: (text, record) => {
        return (
          <Row style={{ alignItems: 'baseline' }}>
            {record?.rate !== 0 && (
              <Rate
                value={record?.rate}
                disabled={true}
                style={{ color: '#00263d', fontSize: '16px' }}
              />
            )}
            {record?.status === 1 && (
              <div
                style={{
                  width: '110px',
                  height: '30px',
                  padding: '4px 10px',
                  marginLeft: '5px',
                  borderRadius: '14px',
                  backgroundColor: '#c9f7f4',
                  textAlign: 'center',
                  color: '#3abcca',
                }}
              >
                <FormattedMessage {...messages.interested} />
              </div>
            )}
            {record?.status === 2 && (
              <div
                style={{
                  width: '110px',
                  height: '30px',
                  padding: '4px 10px',
                  marginLeft: '5px',
                  borderRadius: '14px',
                  backgroundColor: '#fff3e0',
                  textAlign: 'center',
                  color: '#ffa800',
                }}
              >
                <FormattedMessage {...messages.discuss} />
              </div>
            )}
          </Row>
        );
      },
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      align: 'left',
      width: '200px',
      render: (_, record) => {
        return (
          <p
            style={{
              whiteSpace: 'break-spaces',
              margin: '0',
              wordBreak: 'break-word',
            }}
          >
            {record?.comment}
          </p>
        );
      },
    },
  ];
  const columns = [
    {
      title: 'Client First Name',
      dataIndex: 'first_name',
      key: 'first_name',
      width: '15%',
    },
    {
      title: 'Client Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
      width: '15%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '20%',
    },
    {
      title: 'Contact Number',
      dataIndex: 'contract_number',
      key: 'contract_number',
      width: '15%',
    },
    {
      title: 'Tracking',
      dataIndex: 'tracking',
      key: 'tracking',
      render: (track, record) => {
        return (
          <Row className={`table-checkbox-wrapper`}>
            <Checkbox
              checked={record.is_invite && record.is_invite}
            >
              <FormattedMessage {...messages.invite} />
            </Checkbox>
            <Checkbox
              checked={record.in_review && record.in_review}
            >
              <FormattedMessage {...messages.inReview} />
            </Checkbox>
            <Checkbox
              checked={record.has_feedback && record.has_feedback}
            >
              <FormattedMessage {...messages.feedbackProvided} />
            </Checkbox>

            {
              !record.interview_status || record.interview_status === 0 ?
                <span
                  style={{ cursor: 'pointer', color: 'gray' }}
                  onClick={() => openInterViewModal(record)}
                >
                  <FontAwesomeIcon style={{ marginLeft: 5, paddingRight: 5, fontSize: 18 }} icon={faComments} />
                  <FormattedMessage {...messages.interview} />
                </span> : null
            }

            {
              record.interview_status === 1 ?
                <span
                  style={{ cursor: 'pointer', color: '#ffa900' }}
                  onClick={() => openInterViewModal(record)}
                >
                  <FontAwesomeIcon style={{ marginLeft: 5, paddingRight: 5, fontSize: 18 }} icon={faSpinner} />
                  <FormattedMessage {...messages.interview} />
                </span> : null
            }

            {
              record.interview_status === 2 ?
                <span
                  style={{
                    cursor: 'pointer',
                    color: 'white',
                    background: '#87cb16',
                    padding: 2,
                    paddingLeft: 5,
                    paddingRight: 5,
                    borderRadius: 15,
                  }}
                  onClick={() => openInterViewModal(record)}
                >
                  <FontAwesomeIcon style={{ marginLeft: 5, paddingRight: 5, fontSize: 18 }} icon={faComments} />
                  <FormattedMessage {...messages.interview} />
                </span> : null
            }
          </Row>
        );
      },
      width: '60%',
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      align: 'right',
      render: (text, record) => {
        return (
          <>
            <Row
              gutter={[{ xs: 8, sm: 8, md: 8, lg: 8, xl: 16, xxl: 16 }, 0]}
              align="middle"
              justify="end"
            >
              <Col>
                {record?.is_invite ? (
                  <ActionType
                    onClick={() =>
                      handleConfirmRevoke(record?.client_contact_id)
                    }
                    type="revoke"
                  />
                ) : (
                  <ActionType
                    onClick={() =>
                      handleConfirmInvite(record?.client_contact_id, record)
                    }
                    type="invite"
                  />
                )}
              </Col>
              <Col style={{ textAlign: 'center' }}>
                <ModalCustom
                  width={1000}
                  showModal={showModelFeedback}
                  toggleModal={toggleFeedback}
                  handleCancel={handleClose}
                  wrapClassName={`vertical-center-modal feedback-modal`}
                  title={
                    <span
                      className={`text-22-bold`}
                      style={{ fontWeight: 'bold' }}
                    >
                      <FormattedMessage {...messages.modalTitleFeedback} />{' '}
                      {record?.contact_name}
                    </span>
                  }
                  footer={[
                    <Row gutter={[8, 0]} justify="center" key="add_client">
                      <Col>
                        <ButtonCustom
                          case="static"
                          className="btn-danger btn-77-40"
                          onClick={handleClose}
                        >
                          <FormattedMessage {...messages.btnClose} />
                        </ButtonCustom>
                      </Col>
                    </Row>,
                  ]}
                >
                  <TableCustom
                    loading={clientFeedbackLoad}
                    dataSource={clientFeedbackResult?.feedback_list}
                    columns={columnFeedbacks}
                    pagination={false}
                    key={c => c.key}
                    scroll={{ y: 400, x: 800 }}
                  />
                </ModalCustom>
                <ActionType
                  type="feedback"
                  onClick={() =>
                    handleOpenFeedback(
                      record?.client_contact_id,
                      record?.has_feedback,
                    )
                  }
                />
              </Col>
              <Col>
                <PopConfirmCustom
                  title={`Are you sure to delete?`}
                  onConfirm={() =>
                    handleDeleteClientContact(record.client_contact_id)
                  }
                  onCancel={() => { }}
                  okText={`Yes`}
                  cancelText={`No`}
                >
                  <ActionType type="delete" />
                </PopConfirmCustom>
              </Col>
            </Row>
          </>
        );
      },
      width: '40%',
    },
  ];

  const openInterViewModal = async (record) => {
    setSelectedContact(record);
    setToggleInterviewModal(true);
  }

  return (
    <FormInfoDetail
      title={<FormattedMessage {...messages.clientList} />}
      actions={
        <Row className="action-group" gutter={[8, 8]}>
          <Col>
            {!isInvitedAll ? (
              <ButtonCustom
                className="btn-default-outline"
                onClick={handleConfirmInviteAll}
              >
                <MailOutlined className="icon-btn" />
                <FormattedMessage {...messages.inviteAllClient} />
              </ButtonCustom>
            ) : (
              <ButtonCustom
                className="btn-default-outline"
                onClick={handleConfirmRevokeAll}
              >
                <MailOutlined className="icon-btn" />
                <FormattedMessage {...messages.revokeAllClient} />
              </ButtonCustom>
            )}
          </Col>
          <Col>
            <ModalCustom
              btnName={
                <ButtonCustom case="static" className="btn-primary-gradient">
                  <PlusOutlined className="icon-btn" />
                  <FormattedMessage {...messages.addNewClient} />
                </ButtonCustom>
              }
              width={1100}
              showModal={showModal}
              toggleModal={toggleModal}
              handleOk={handleSubmit}
              handleCancel={handleCancel}
              wrapClassName={`add-contact-modal`}
              title={
                <span className={`text-22-bold add-client`}>
                  <FormattedMessage {...messages.addClient} />
                </span>
              }
              footer={[
                <Row gutter={[8, 0]} justify="center" key="add_client">
                  <Col>
                    <ButtonCustom
                      case="static"
                      className="btn-danger btn-77-40"
                      onClick={handleCancel}
                    >
                      <FormattedMessage {...messages.cancel} />
                    </ButtonCustom>
                  </Col>
                  <Col>
                    <ButtonCustom
                      className="btn-primary-gradient btn-77-40"
                      onClick={handleSubmit}
                    >
                      <FormattedMessage {...messages.add} />
                    </ButtonCustom>
                  </Col>
                </Row>,
              ]}
            >
              <Formik
                initialValues={initValueAddContact}
                innerRef={formRef}
                validationSchema={schema}
                onSubmit={onFinish}
              >
                {({ values, setFieldValue }) => (
                  <>
                    <Form layout="vertical" className={'add-contact-form'}>
                      <FieldArray name="contactList">
                        {({ push, remove }) => (
                          <>
                            <div className={`recruiter-wrapper-scroll`}>
                              {values.contactList &&
                                values.contactList?.map((contact, index) => (
                                  <div key={index} className={`recruiter-list`}>
                                    <Row
                                      gutter={[32, 0]}
                                      justify="space-between"
                                      align="center"
                                      className={`recruiter-row`}
                                    >
                                      <Col xs={24} sm={12} lg={4}>
                                        <Form.Item
                                          hasFeedback={true}
                                          label="CLIENT FIRST NAME"
                                          showValidateSuccess={true}
                                          name={`contactList[${index}].first_name`}
                                        >
                                          <AutoComplete
                                            name={`contactList[${index}].first_name`}
                                            disabled={contact?.id && true}
                                            options={contacts}
                                            onChange={(
                                              value,
                                              option,
                                              i = index,
                                            ) => {
                                              const data = { option, i };
                                              handleChangeFirstName(
                                                data,
                                                setFieldValue,
                                              );
                                            }}
                                            className={`add-client-input`}
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24} sm={12} lg={4}>
                                        <Form.Item
                                          label="CLIENT LAST NAME"
                                          hasFeedback={true}
                                          showValidateSuccess={true}
                                          name={`contactList[${index}].last_name`}
                                        >
                                          <InputCustom
                                            fast={true}
                                            bgwhite={`true`}
                                            name={`contactList[${index}].last_name`}
                                            disabled={contact?.id && true}
                                            className={`add-client-input`}
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24} sm={12} lg={8}>
                                        <Form.Item
                                          hasFeedback={true}
                                          label="EMAIL"
                                          showValidateSuccess={true}
                                          name={`contactList[${index}].email`}
                                        >
                                          <InputCustom
                                            fast={true}
                                            bgwhite={`true`}
                                            name={`contactList[${index}].email`}
                                            disabled={contact?.id && true}
                                            className={`add-client-input`}
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24} sm={12} lg={4}>
                                        <Form.Item
                                          hasFeedback={true}
                                          label="CONTACT NUMBER"
                                          showValidateSuccess={true}
                                          name={`contactList[${index}].contact_number`}
                                          className={`recruiter-item size-50`}
                                        >
                                          <InputCustom
                                            fast={true}
                                            bgwhite={`true`}
                                            name={`contactList[${index}].contact_number`}
                                            disabled={contact?.id && true}
                                            className={`add-client-input`}
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col
                                        style={{ display: 'flex' }}
                                        xs={24}
                                        sm={2}
                                        lg={2}
                                      >
                                        {values?.contactList?.length - 1 ===
                                          index ? (
                                          <ActionType
                                            type="add"
                                            onClick={() => {
                                              push({
                                                first_name: '',
                                                last_name: '',
                                                email: '',
                                                contact_number: '',
                                                id: '',
                                              });
                                            }}
                                          />
                                        ) : (
                                          <ActionType
                                            onClick={() => {
                                              remove(index);
                                              if (contact?.id)
                                                handleChangeContacts(
                                                  contact,
                                                  true,
                                                );
                                            }}
                                            type="delete"
                                          />
                                        )}
                                      </Col>
                                    </Row>
                                  </div>
                                ))}
                            </div>
                          </>
                        )}
                      </FieldArray>
                    </Form>
                  </>
                )}
              </Formik>
            </ModalCustom>
          </Col>
        </Row>
      }
    >
      <TableCustom
        {...props}
        scroll={{ y: 250, x: 1366 }}
        loading={isLoading}
        columns={columns}
        dataSource={contactListInJobs}
        pagination={false}
        key={c => c.key}
      />

      <InterviewModal
        selectedContact={selectedContact}
        shortlistedCandidateList={shortlistedCandidateList}
        toggleInterviewModal={toggleInterviewModal}
        showInterviewModal={showInterviewModal}
        handleInterviewCancel={handleInterviewCancel}
        handleInterviewSubmit={(values) => handleInterviewSubmit(values)}

      />
    </FormInfoDetail>
  );
};

const mapStateToProps = createStructuredSelector({
  clientContactJobs: makeSelectClientContactJobtate(),
  clientContactJobsLoad: makeSelectClientContactJobtateLoad(),
  clientContactInJob: makeSelectClientContactInJobState(),
  clientContactInJobLoad: makeSelectClientContactInJobStateLoad(),
  addMoreContactLoad: makeSelectAddMoreContactToJobLoad(),
  addMoreContactResult: makeSelectAddMoreContactToJobResult(),
  inviteContactJobLoad: makeSelectInviteContactJobLoad(),
  inviteContactJobResult: makeSelectInviteContactJobResult(),
  invitedError: makeSelectInviteError(),
  deleteContactJobLoad: makeSelectDeleteContactJobLoading(),
  deleteContactJobResult: makeSelectDeleteContactJobResult(),
  clientFeedbackLoad: makeSelectClientFeedbackLoading(),
  clientFeedbackResult: makeSelectClientFeedbackSuccess(),
  revoked: makeSelectRevokedSuccess(),
  revokedLoading: makeSelectRevokedLoading(),
  revokedError: makeSelectRevokedError(),
  shortlistedCandidateResult: makeSelectShortlistedCandidateJobResult(),
});

const mapDispatchToProps = {
  getAvailableContactJob,
  cleanAvailableJob,
  getContactInJob,
  inviteContactOnJob,
  cleanInviteContact,
  deleteContactInJob,
  cleanDeleteContactJob,
  addMoreContactToJob,
  cleanAddMoreContact,
  cleanContactInJob,
  getClientFeedbackAction,
  clearClientFeedbackAction,
  revokeClientAction,
  revokeAllAction,
  clearRevoked,
  inviteAllAction,
  getShortlistedCandidate,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ClientList);
