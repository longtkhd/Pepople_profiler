/**
 *
 * InviteClientEmail
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
import MainLayout from 'components/layout/MainLayout';
import ButtonBack from 'components/ButtonBack';
import FormInfoDetail from 'components/FormInfoDetail';
import { Input, Row, Col, Descriptions, Button, Title, Modal } from 'antd';
// import ButtonCustom from 'components/atoms/button'
import { EyeOutlined, SyncOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import SelectCustom from './selectCustomGetSelected';
import InputCustom from 'components/InputCustom';
import { InputOldCustom } from 'components/InputCustom';
import ModalCustom from 'components/ModalCustom';
import HeadingMedium from 'components/HeadingMedium';
import CloseButton from 'components/CloseButton';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import InlineEditor from '@ckeditor/ckeditor5-build-inline'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor';
//import action
import {
  getMailTemplateUserDefault,
  addMailTemplateDefault,
  getMailTemplateDefault,
} from './actions';
import {
  getShortlistedCandidate,
  cleanUpShortlistedCandidate,
} from 'containers/common_provider/candidate_state/get_shortlisted_candidate_job/actions';
import {
  inviteContactOnJob,
  inviteAllAction,
  cleanInviteContact,
} from 'containers/common_provider/client_state/invite_contact_on_job/actions';
import {
  getJobDetail,
  cleanUpJobDetail,
} from 'containers/common_provider/create_job_state/get_job_detail/actions';

//import selector
import {
  makeSelectInviteClientEmail,
  makeSelectInviteClientEmailSuccess,
  makeSelectInviteClientEmailInfoSuccess,
  makeSelectAddEmailTemplateSuccess,
  makeSelectAddEmailTemplateError,
} from './selectors';
import { makeSelectShortlistedCandidateJobResult } from 'containers/common_provider/candidate_state/get_shortlisted_candidate_job/selectors';
import { makeSelectAgencyInfo } from 'containers/common_provider/get_agency_info/selectors';
import { makeSelectUserInfo } from 'containers/common_provider/get_user_info/selectors';
// import {makeSelectJobDetail} from 'containers/common_provider/create_job_state/get_job_detail/selectors'
import makeSelectJobDashBoard, {
  makeSelectJobDetail,
  makeSelectJobDetailLoading,
} from 'containers/job_dashboard/selectors';

import { makeSelectInviteContactJobResult } from 'containers/common_provider/client_state/invite_contact_on_job/selectors';
import {
  makeSelectSaveRecruitmentActivityLoad,
  makeSelectSaveRecruitmentActivityResult,
} from 'containers/common_provider/create_job_state/activity_recruitment_job/selectors';

import { Formik, useFormikContext } from 'formik';
import { Form } from 'formik-antd';
import './styles.less';
import data from './data.json';
import { getUserInfo } from 'services/authentication';
// import modalSaveTemplate from './modalSaveTemplate'
import { openNotification } from 'utils/notification';
import PreviewModal from 'components/PreviewModalEmail';
import { ContentModal } from '../../components/modals/ContentModal';
import DowngradeNotiIcon from 'images/icons/combined-shape.png';

export function InviteClientEmail(props) {
  const {
    history,
    location,
    onGetMailTemplate,
    mailTemplateData,
    onGetTemplateInfo,
    mailTemplateInfo,
    getShortlistedCandidate,
    shortlistedCandidateResult,
    onInviteContact,
    getJobDetail,
    jobDetail,
    onSaveTemplate,
    statusSaveTemplate,
    sendMailStatus,
    statusError,
  } = props;
  

  useEffect(() => {
    if (sendMailStatus) {
      // openNotification('success', 'Send Email Success!');
      Modal.confirm({
        title: false,
        icon: false,
        centered: true,
        className: 'nem-modal-confirm',
        content: (
          <ContentModal
            title={<FormattedMessage {...messages.alright} />}
            message={<FormattedMessage {...messages.sendSuccess} />}
            isSuccess={true}
          />
        ),
        okText: <FormattedMessage {...messages.done} />,
        // cancelText: <FormattedMessage {...messages.requestChange} />,
        cancelButtonProps: { className: 'modal-btn-cancel d-none' },
        okButtonProps: { className: 'modal-btn-ok' },
        onOk() {
          history.push(`/job-dashboard/${jobDetail_id}`);
          localStorage.removeItem('dataInvite');
        },
      });
    }
  }, [sendMailStatus]);
  const Content = ({ title, message }) => {
    return (
      <div className="invite-confirm-content">
        <img src={DowngradeNotiIcon} alt="downgrade-notification" />
        <p className="title">{title}</p>
        <p className="description">{message}</p>
      </div>
    );
  };
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
        okText: <FormattedMessage {...messages.done} />,
        // cancelText: <FormattedMessage {...messages.requestChange} />,
        cancelButtonProps: { className: 'modal-btn-cancel d-none' },
        okButtonProps: { className: 'modal-btn-ok' },
        onOk() {
          onGetMailTemplate({
            params: {
              type: 1,
            },
          });
        },
      });
    }
  }, [statusSaveTemplate]);

  useEffect(() => {
    if (statusError) {
      openNotification('error', 'Oops, Something went wrong!');
    }
  }, [statusError]);

  const [selectedMail, setSelectedMail] = useState(null);
  const defaultUserInfo = getUserInfo();
  const [toggleModal, setToggleModal] = useState(false);
  
  const showModal = () => {
    setToggleModal(true);
  };

  const handleCancel = e => {
    setToggleModal(false);
  };

  useEffect(() => {
    onGetMailTemplate({
      params: {
        type: 1,
      },
    });
  }, []); //get mail template by type

  useEffect(() => {
    if (selectedMail) {
      onGetTemplateInfo(selectedMail);
    }
  }, [selectedMail]); //get current selected template

  useEffect(() => {
    getJobDetail(agency_id, jobId);
  }, [jobDetail?.recruitment_activity[0]?.value]);

  const TemplateOption = useMemo(() => {
    let options = [];
    mailTemplateData &&
      mailTemplateData.map(({ name, id }) => {
        options.push({
          value: id,
          label: name,
        });
      });
    return options;
  }, [mailTemplateData, statusSaveTemplate, history.location]);

  const options = [
    {
      value: 1,
      label: 'Client Invite',
    },
    // {
    //   value: 2,
    //   label: 'Candidate Invite',
    // },
  ];

  const jobDetail_id = props.match.params.id;
  const agency_name = defaultUserInfo?.agency_name || '';
  const contact_number = defaultUserInfo?.phone || '';
  const recruiter_name = `${defaultUserInfo?.firstname} ${
    defaultUserInfo?.lastname
  }`;
  const dataInvite = JSON.parse(localStorage.getItem('dataInvite'));
  const contact_name = `${dataInvite?.contact_first_name ||''}`;
  const contact_id = dataInvite?.contact_id;
  const jobId = dataInvite?.jobId;
  const agency_id = defaultUserInfo?.agency_id;
  const job_position = jobDetail?.job_title;
  const company_name = jobDetail?.business_name || '';

  const application_count = jobDetail?.recruitment_activity
    ? jobDetail?.recruitment_activity[0]?.value
    : '';

  const name_template = mailTemplateInfo
    ? mailTemplateInfo?.name
    : `[Email Template Name]`;

  const handleSendMail = values => {
    onInviteContact(contact_id, jobDetail_id, {
      subject: RegexdSubject(values?.subject),
      body: values.inviteContent,
    });
  }; // send mail
  const handleSendMailPreviewCallBack = useCallback(values => {
    onInviteContact(contact_id, jobDetail_id, {
      subject: RegexdSubject(values?.subject),
      body: values.inviteContent,
    });
  }, []);

  const handleClear = (values, setFieldValue) => {
    console.log('clear');
  };

  const RegexedContent = content => {
    // console.log('here', jobDetail?.recruitment_activity[0].value);
    return content
      .replace(/\[CONTACT_NUMBER]/g, `<strong>${contact_number}</strong>`, '')
      .replace(/\[CLIENT_NAME]/g, `<strong>${contact_name}</strong>`, '')
      .replace(/\[AGENCY_NAME]/g, `<strong>${agency_name}</strong>`, '')
      .replace(/\[DATE_MEETING]/g, `<strong>${new Date()}</strong>`, '')
      .replace(/\[RECRUITER'S_NAME]/g, `<strong>${recruiter_name}</strong>`, '')
      .replace(/\[COMPANY_NAME]/g, `${company_name}`, '')
      .replace(/\[JOB_POSITION]/g, `${job_position}`, '')
      .replace(
        /\[APPLICANTS_COUNT]/g,
        application_count
          ? `These candidates have been selected from a total pool of <strong>${application_count}</strong> applicants</strong>.`
          : '',
        '',
      );
  };

  const RegexdSubject = subject => {
    return subject
      .replace(/\[CLIENT_NAME]/g, `${contact_name}`, '')
      .replace(/\[JOB_POSITION]/g, `${job_position}`, '')
      .replace(/\[COMPANY_NAME]/g, `${company_name}`, '');
  };

  const contentRegex = mailTemplateInfo?.content;

  const initialValues = {
    subject: mailTemplateInfo ? mailTemplateInfo.subject : data.heading,
    content: mailTemplateInfo ? mailTemplateInfo.content : data?.content,
    template: mailTemplateInfo
      ? mailTemplateInfo?.name
      : 'Select from 1 template',
    name: '',
    type: 1,
    typePreview: 1,
    inviteContent: mailTemplateInfo ? RegexedContent(mailTemplateInfo.content) : RegexedContent(data.content),
  };

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
  useInjectReducer({ key: 'inviteClientEmail', reducer });


  return (
    <div>
      <Helmet>
        <title>Invite Client Email</title>
        <meta name="description" content="Description of InviteClientEmail" />
      </Helmet>
      <MainLayout mainLayoutStyles={{ backgroundColor: '#ffffff' }}>
        <div className="btn-back">
          <ButtonBack history={history} />
        </div>
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          onSubmit={handleSendMail}
        >
          {({ values, setFieldValue, resetForm }) => (
            <Form>
              <div className="email-user-template">
                <Row flex="flex" justify="space-between" align="middle">
                  <Col lg={12}>
                    <div className="title-invite-client">
                      <p>
                        {recruiter_name}, prepare your email to {contact_name}{' '}
                        from {company_name}
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
                          contentPreview={values.inviteContent}
                          setFieldValue={setFieldValue}
                          name_template={name_template}
                          handleSendMailPreviewCallBack={() =>
                            handleSendMailPreviewCallBack(values)
                          }
                          typeTemplate={1}
                          lableContent={'Invite Content'}
                        />
                      </Col>

                      <Col lg={8}>
                        <Button
                          type="danger "
                          icon={<SyncOutlined style={{ fontWeight: 'bold' }} />}
                          onClick={() => handleClear(values, setFieldValue)}
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
                      <div className={'lable-invite'}>Content</div>
                      <CKEditor
                        // config={{
                        //   extraPlugins: 'simplebutton'
                        // }}
                        key={`resume_linked`}
                        editor={ClassicEditor}
                        config={ckConfig} 
                        label="Content"
                        name="content"
                        type="text"
                        data={
                          mailTemplateInfo ? contentRegex : data?.content || {}
                        }
                        onReady={editor => {
                          if (editor) {
                            const data = editor.getData();
                            // setFieldValue('content', data);
                          }
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          // handleSetContent(data);
                          setFieldValue('content', data);
                          setFieldValue('inviteContent', RegexedContent(data));                         
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
                              className="btn-default-outline button__save_template styles__email"
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
                              // onSelect={(selected) => setSelectedMail(selected)}
                            />
                          </Col>
                        </Row>
                        <Button
                          className="button-submit-inside"
                          type="primary"
                          onClick={() => {
                            handleSaveTemplate(values, setFieldValue);
                          }}
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
                        className="gradient-button styles__email"
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
      </MainLayout>
    </div>
  );
}

InviteClientEmail.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  inviteClientEmail: makeSelectInviteClientEmail(),
  mailTemplateData: makeSelectInviteClientEmailSuccess(),
  mailTemplateInfo: makeSelectInviteClientEmailInfoSuccess(),
  agencyInfo: makeSelectAgencyInfo(),
  users: makeSelectUserInfo(),
  shortlistedCandidateResult: makeSelectShortlistedCandidateJobResult(),
  statusSaveTemplate: makeSelectAddEmailTemplateSuccess(),
  statusError: makeSelectAddEmailTemplateError(),
  jobDetail: makeSelectJobDetail(),
  sendMailStatus: makeSelectInviteContactJobResult(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetMailTemplate: params => dispatch(getMailTemplateUserDefault(params)),
    onGetTemplateInfo: id => dispatch(getMailTemplateDefault(id)),
    getShortlistedCandidate,
    getJobDetail: (agencyId, jobId) => dispatch(getJobDetail(agencyId, jobId)),
    onInviteContact: (contactId, jobId, params) =>
      dispatch(inviteContactOnJob(contactId, jobId, params)),
    onSaveTemplate: data => dispatch(addMailTemplateDefault(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(InviteClientEmail);
