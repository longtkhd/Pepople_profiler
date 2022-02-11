/**
 *
 * InviteAssessmentEmail
 *
 */

import React, { memo, useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectReducer } from 'utils/injectReducer';

import reducer from './reducer';
import messages from './messages';

import ButtonBack from 'components/ButtonBack';
import { Formik } from 'formik';
import { Form } from 'formik-antd';
import { openNotification } from 'utils/notification';
import { Row, Col, Button, Modal } from 'antd';
import { Link } from 'react-router-dom';
import SelectCustom from 'containers/invite_client_email/selectCustomGetSelected';
import InputCustom from 'components/InputCustom';
import { InputOldCustom } from 'components/InputCustom';
import ModalCustom from 'components/ModalCustom';
import HeadingMedium from 'components/HeadingMedium';
import CloseButton from 'components/CloseButton';
import SpinnerLoading from 'components/SpinnerLoading';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor';
import MainLayout from 'components/layout/MainLayout';
import { SyncOutlined } from '@ant-design/icons';
import './styles.less';
import PreviewModal from 'components/PreviewModalEmail';
import { sendInviteCandidateAssessmentAction } from 'containers/common_provider/send_mail_assessment/actions';

import {
  makeSelectSendMailAssessmentSuccess,
  makeSelectSendMailAssessmentLoading,
  makeSelectSendMailAssessmentError,
} from '../common_provider/send_mail_assessment/selectors';

import {
  getMailTemplateUserDefault,
  getMailTemplateDefault,
  addMailTemplateDefault,
} from './actions';
import {
  makeSelectInviteAssessmentEmail,
  makeSelectInviteAssessmentEmailSuccess,
  makeSelectInviteAssessmentEmailInfoSuccess,
  makeSelectAddEmailTemplateSuccess,
  makeSelectAddEmailTemplateError,
} from './selectors';
import initialEmail from './initialEmail.json';
import { getUserInfo } from 'services/authentication';

import {
  inviteContactOnJob,
  inviteAllAction,
  cleanInviteContact,
} from 'containers/common_provider/client_state/invite_contact_on_job/actions';

import {
  getCandidateDetail,
  cleanUpCandidateDetail,
} from 'containers/common_provider/candidate_state/get_candidate_detail/actions';
import {
  makeSelectCandidateDetailLoading,
  makeSelectCandidateDetailResult,
} from 'containers/common_provider/candidate_state/get_candidate_detail/selectors';
import { ContentModal } from '../../components/modals/ContentModal';
import DowngradeNotiIcon from 'images/icons/combined-shape.png';

export function InviteAssessmentEmail(props) {
  useInjectReducer({ key: 'inviteAssessmentEmail', reducer });

  const {
    history,
    onGetMailTemplate,
    onGetTemplateInfo,
    mailAssessmentTemplate,
    mailAssessmentInfo,
    onSaveTemplate,
    onSendMailAssessment,
    getCandidateDetail,
    candidateDetail,
    statusSaveTemplate,
    statusError,
    sendInviteLoading,
    sendInviteError,
    sendInviteSuccess,
  } = props;
  const [toggleModal, setToggleModal] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);
  const defaultUserInfo = getUserInfo();
  const candidate_id = props.match.params.id;
  const data_assessment = JSON.parse(localStorage.getItem('dataAssessment'));
  const candidateInfo = JSON.parse(
    localStorage.getItem(`candidateInfo${candidate_id}`),
  );
  // const assessment_name = data_assessment?.name;
  // const project_assessment = data_assessment?.project_access_key;
  const TP_PROJECT_NAME =
    JSON.stringify(process.env.TP_PROJECT_NAME) ||
    'TPAQ-27 Express Personality Profile';
  const TP_PROJECT_KEY =
    JSON.stringify(process.env.TP_PROJECT_KEY) || 'People_P_0089093474';
  const assessment_name = TP_PROJECT_NAME;
  const project_assessment = TP_PROJECT_KEY;
  const recruiter_name = `${defaultUserInfo?.firstname} ${
    defaultUserInfo?.lastname
  }`;
  const contact_number = defaultUserInfo?.phone;
  const agency_name = defaultUserInfo?.agency_name;
  const ckConfig = {
				
    toolbar: {
      items: [
        'heading',
						'|',
						'bold',
						'italic',
						'link',
						'bulletedList',
						'numberedList',
						'|',
						'indent',
						'outdent',
						'|',
						'horizontalLine',
						'blockQuote',
						'insertTable',
						'undo',
						'redo',
						'fontColor',
						'fontSize',
						'pageBreak',
						'underline'
      ]
    },
    language: 'en',
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:full',
        'imageStyle:side'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    }
  }
  const name_template = mailAssessmentInfo?.name
    ? mailAssessmentInfo?.name
    : `[Email Template Name]`;
  const candidate_name = candidateDetail?.candidate_name
    ? candidateDetail?.candidate_name
    : candidateInfo
    ? candidateInfo.candidate_name
    : '';
  const role_industry = data_assessment?.industry;
  const role_type = data_assessment?.type;
  const jobId = data_assessment?.jobId;
  // useEffect(() => {
  //   console.log(candidateDetail);
  // });

  const showModal = () => {
    setToggleModal(true);
  };
  const handleCancel = e => {
    setToggleModal(false);
  };

  const options = [
    {
      value: 2,
      label: 'Assessment Invite',
    },
  ];

  function sendInviteSuccessModal() {
    Modal.success({
      centered: true,
      title: false,
      icon: false,
      className: 'nem-modal-confirm',
      content: (
        <ContentModal
          title={<FormattedMessage {...messages.inviteSuccessTitle} />}
          message={<FormattedMessage {...messages.inviteSuccessMessage} />}
          isSuccess={true}
        />
      ),
      okText: <FormattedMessage {...messages.inviteDone} />,
      onOk() {
        history.push(`/candidate-report/${candidate_id}/${jobId}`);
        localStorage.removeItem('dataAssessment');
      },
    });
  }

  useEffect(() => {
    getCandidateDetail(candidate_id);
  }, [candidate_id]);

  const TemplateOption = useMemo(() => {
    let options = [];
    mailAssessmentTemplate &&
      mailAssessmentTemplate.map(({ name, id }) => {
        options.push({
          value: id,
          label: name,
        });
      });
    return options;
  }, [mailAssessmentTemplate, statusSaveTemplate]);

  useEffect(() => {
    onGetMailTemplate({
      params: {
        type: 2,
      },
    });
  }, []);

  useEffect(() => {
    if (selectedMail) {
      onGetTemplateInfo(selectedMail);
    }
  }, [selectedMail]);

  const Content = ({ title, message }) => {
    return (
      <div className="invite-confirm-content">
        <img src={DowngradeNotiIcon} alt="downgrade-notification" />
        <p className="title">{title}</p>
        <p className="description">{message}</p>
      </div>
    );
  };

  useEffect(() => {
    if (statusSaveTemplate) {
      // openNotification('success', 'Save Template Success');
      Modal.confirm({
        title: false,
        icon: false,
        centered: true,
        className: 'nem-modal-confirm',
        content: (
          <ContentModal
            title={<FormattedMessage {...messages.saved} />}
            message={<FormattedMessage {...messages.EmailSaved} />}
            isSuccess={true}
          />
        ),
        okText: <FormattedMessage {...messages.inviteDone} />,
        // cancelText: <FormattedMessage {...messages.requestChange} />,
        cancelButtonProps: { className: 'modal-btn-cancel d-none' },
        okButtonProps: { className: 'modal-btn-ok' },
        onOk() {
          onGetMailTemplate({
            params: {
              type: 2,
            },
          });
        },
      });
    }
  }, [statusSaveTemplate]);

  useEffect(() => {
    if (statusError) {
      openNotification('error', 'Oops, Somthing went wrong!');
    }
  }, [statusError]);

  useEffect(() => {
    if (sendInviteSuccess) {
      sendInviteSuccessModal();
    }
  }, [sendInviteSuccess]);

  useEffect(() => {
    if (sendInviteError) {
      let message =
        sendInviteError?.message === 'MAX_ASSESSMENT_LIMIT'
          ? 'You have exceeded the invitation assement limit.'
          : 'Send invite assessment faild.';
      // Modal.error({
      //   title: 'Oops, Somthing went wrong!',
      //   content: message,
      //   centered: true,
      // });
      Modal.confirm({
        title: false,
        icon: false,
        centered: true,
        className: 'contact-modal-confirm',
        content: <Content title="Error" message={message} />,
        okText: <FormattedMessage {...messages.inviteDone} />,
        // cancelText: <FormattedMessage {...messages.requestChange} />,
        cancelButtonProps: { className: 'modal-btn-cancel d-none' },
        okButtonProps: { className: 'modal-btn-ok' },
      });
    }
  }, [sendInviteError]);

  const handleSaveTemplate = (values, setFieldValue) => {
    onSaveTemplate({
      content: values.content,
      subject: values.subject,
      type: values.type,
      name: values.name,
    });
    setToggleModal(false);
    setFieldValue('type', null);
    setFieldValue('name', null);
  };
  const handleSendAssessmentMail = values => {
    const data = {
      subject: RegexdSubject(values?.subject),
      body: values.inviteContent,
      candidate_id: candidate_id,
      project_assessment: project_assessment,
      industry: role_industry,
      type: role_type,
      job_id: jobId,
    }
    onSendMailAssessment(candidate_id, data);
  };

  const handleSendMailPreviewCallBack = useCallback(values => {
    const data = {
      subject: RegexdSubject(values?.subject),
      body: values.inviteContent,
      candidate_id: candidate_id,
      project_assessment: project_assessment,
    }
    onSendMailAssessment(candidate_id, data);
  }, []);

  const RegexedContent = content => {
    return content
      .replace(/\{Assessment Name}/g, `<strong>${assessment_name}</strong>`, '')
      .replace(/\{Contact Number}/g, `<strong>${contact_number}</strong>`, '')
      .replace(/\{Recruiter's Name}/g, `<strong>${recruiter_name}</strong>`, '')
      .replace(/\{Company Name}/g, `<strong>${agency_name}</strong>`, '')
      .replace(
        /\{Candidate's First Name}/g,
        `<strong>${candidate_name}</strong>`,
        '',
      );
  };
  const RegexdSubject = subject => {
    return subject.replace(/\{Assessment Name}/g, `${assessment_name}`, '');
  };

 
  
  const content = mailAssessmentInfo?.content;
  const initialValues = {
    subject: mailAssessmentInfo ? mailAssessmentInfo?.subject : initialEmail.subject,
    template: mailAssessmentInfo
      ? mailAssessmentInfo?.name
      : 'Select from 1 template',
    content: mailAssessmentInfo ? mailAssessmentInfo?.content : initialEmail.content,
    name: '',
    type: 2,
    typePreview: 2,
    inviteContent: mailAssessmentInfo ? RegexedContent(mailAssessmentInfo.content) :  RegexedContent(initialEmail.content),
  };
  
  return (
    <div>
      <Helmet>
        <title>InviteAssessmentEmail</title>
        <meta
          name="description"
          content="Description of InviteAssessmentEmail"
        />
      </Helmet>
      <MainLayout mainLayoutStyles={{ backgroundColor: '#ffffff' }}>
        <div className="btn-back">
          <ButtonBack history={history} />
        </div>
        {sendInviteLoading && <SpinnerLoading loading={sendInviteLoading} />}
        {!sendInviteLoading && (
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            onSubmit={handleSendAssessmentMail}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div className="email-user-template">
                  <Row flex="flex" justify="space-between" align="middle">
                    <Col lg={12}>
                      <div className="title-invite-client">
                        <p>
                          {recruiter_name}, Prepare your email to{' '}
                          {candidate_name}{' '}
                        </p>
                      </div>
                    </Col>
                    <Col lg={4} md={24} xl={4} xs={24}>
                      <Form.Item
                        name="template"
                        className={`wrapper-group-input-ant`}
                      >
                        <SelectCustom
                          // fast={true}
                          label=""
                          id="template"
                          name="template"
                          type="text"
                          options={TemplateOption}
                          onSelect={selected => setSelectedMail(selected)}
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={7}>
                      <Row align="middle" justify="end" gutter={[16, 16]}>
                        <Col lg={8}>
                          <PreviewModal
                            name_template={name_template}
                            contentPreview={values.inviteContent}
                            setFieldValue={setFieldValue}
                            typeTemplate={2}
                            handleSendMailPreviewCallBack={() =>
                              handleSendMailPreviewCallBack(values)
                            }
                          />
                        </Col>

                        <Col
                          lg={8}
                          style={{ marginLeft: '3px', maxWidth: '50%' }}
                        >
                          <Button
                            type="danger "
                            icon={
                              <SyncOutlined style={{ fontWeight: 'bold' }} />
                            }
                          >
                            <FormattedMessage {...messages.clear} />
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]}>
                    <Col lg={24} md={24} xl={24} xs={24} ms={24}>
                      <Form.Item
                        name="subject"
                        className={`wrapper-group-input-ant`}
                      >
                        <InputCustom
                          styleformgroup={`mb-20`}
                          label="Subject"
                          name="subject"
                          type="text"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={24} md={24} xl={24} xs={24} ms={24}>
                      <div className="content-editor">
                        <title>a</title>
                        <CKEditor
                          key={`resume_linked`}
                          editor={ClassicEditor}
                          config={ckConfig} 
                          label="Content"
                          name="content"
                          type="text"
                          data={
                            initialValues.content
                          }
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setFieldValue('content', data);
                            setFieldValue('inviteContent',RegexedContent(data))
                            // setContentEmail(data);
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <div className="action-invite">
                    <Row
                      justify="center"
                      align="middle"
                      className="row__button__email"
                    >
                      <Col
                        className="t-center"
                        xs={24}
                        sm={6}
                        md={5}
                        lg={4}
                        xl={3}
                        xxl={2}
                      >
                        <ModalCustom
                          className="custom-modal-request"
                          style={{ borderRarius: '15px' }}
                          type="RequestModal"
                          closable={true}
                          closeIcon={<CloseButton />}
                          title={
                            <HeadingMedium>
                              <FormattedMessage {...messages.save} />
                            </HeadingMedium>
                          }
                          showModal={showModal}
                          toggleModal={toggleModal}
                          handleCancel={handleCancel}
                          // onSubmit={() => console.log('save')}
                          footer={[
                            <>
                              <Row gutter={[8, 0]} justify="center">
                                <Col />
                              </Row>
                            </>,
                          ]}
                          btnName={
                            <>
                              <Button
                                className=" styles__email btn-default-outline button__save_template"
                                type="button"
                              >
                                <FormattedMessage {...messages.save} />
                              </Button>
                            </>
                          }
                        >
                          {/* <FormInfoDetail
                  case="use-form"
                  initialValues={initialModalValues}
                  enableReinitialize
                  onSubmit={handleSaveTemplate}
                  // onSubmit={(values) => console.log(values)}
                > */}
                          <Row>
                            <Col xs={24} md={24} lg={24} xl={24}>
                              <InputOldCustom
                                styleformgroup={`mb-20`}
                                label="Template Name"
                                name="name"
                                type="text"
                              />
                            </Col>
                          </Row>

                          <Row>
                            <Col xs={24} md={24} lg={24} xl={24}>
                              <SelectCustom
                                // fast={true}
                                label="Type"
                                name="type"
                                type="text"
                                options={options}
                                defaultValue={1}
                                onSelect={selected => setSelectedMail(selected)}
                              />
                            </Col>
                          </Row>
                          <Button
                            className="btn-primary-gradient button-submit-inside"
                            type="button"
                            onClick={() =>
                              handleSaveTemplate(values, setFieldValue)
                            }
                          >
                            <FormattedMessage {...messages.saveTitle} />
                          </Button>
                          {/* </FormInfoDetail> */}
                        </ModalCustom>
                      </Col>
                      <Col
                        xs={24}
                        sm={6}
                        md={5}
                        lg={4}
                        xl={3}
                        xxl={2}
                        className="t-center"
                      >
                        <Link to={`/#`}>
                          <Button className={'styles__email'} type="danger">
                            <FormattedMessage {...messages.cancel} />
                          </Button>
                        </Link>
                      </Col>

                      <Col
                        xs={24}
                        sm={6}
                        md={5}
                        lg={4}
                        xl={3}
                        xxl={2}
                        className="t-center"
                      >
                        <Button
                          className="gradient-button  styles__email"
                          htmlType="submit"
                        >
                          <FormattedMessage {...messages.send} />
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </MainLayout>
    </div>
  );
}

InviteAssessmentEmail.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  inviteAssessmentEmail: makeSelectInviteAssessmentEmail(),
  mailAssessmentTemplate: makeSelectInviteAssessmentEmailSuccess(),
  mailAssessmentInfo: makeSelectInviteAssessmentEmailInfoSuccess(),
  statusSaveTemplate: makeSelectAddEmailTemplateSuccess(),
  statusError: makeSelectAddEmailTemplateError(),
  candidateDetail: makeSelectCandidateDetailResult(),
  candidateDetailLoad: makeSelectCandidateDetailLoading(),
  sendInviteSuccess: makeSelectSendMailAssessmentSuccess(),
  sendInviteError: makeSelectSendMailAssessmentError(),
  sendInviteLoading: makeSelectSendMailAssessmentLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetMailTemplate: params => dispatch(getMailTemplateUserDefault(params)),
    onGetTemplateInfo: id => dispatch(getMailTemplateDefault(id)),
    onSaveTemplate: data => dispatch(addMailTemplateDefault(data)),
    onInviteContact: (contactId, jobId, params) =>
      dispatch(inviteContactOnJob(contactId, jobId, params)),
    onSendMailAssessment: (candidateId, data) =>
      dispatch(sendInviteCandidateAssessmentAction(candidateId, data)),
    getCandidateDetail: id => dispatch(getCandidateDetail(id)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(InviteAssessmentEmail);
