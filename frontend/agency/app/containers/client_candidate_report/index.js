/**
 *
 * Clientcandidatereport
 *
 */

import React, { memo, useEffect, useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectClientCandidateReportError,
  makeSelectClientCandidateReportLoading,
  makeSelectClientCandidateReportSuccess,
  makeSelectDownloadDocumentError,
  makeSelectDownloadDocumentLoading,
  makeSelectDownloadDocumentSuccess,
  makeSelectGetClientFeedbackError,
  makeSelectGetClientFeedbackSuccess,
  makeSelectGetClientFeedbackloading,
  makeSelectUpdateFeedbackError,
  makeSelectUpdateFeedbackSuccess,
} from './selectors';
import {
  getCandidateReportAction,
  getClientFeedbackAction,
  updateClientFeedbackAction,
  createClientFeedbackAction,
  downloadDocumentsAction,
  clearAllAction
} from './actions';

import {
  makeSelectDownloadAssessmentLoading,
  makeSelectDownloadAssessmentError,
  makeSelectDownloadAssessmentSuccess,
} from '../common_provider/candidate_state/candidate_document/selectors';
import {
  downloadAssessmentReportAction,
  cleanAllStateDocument,
} from '../common_provider/candidate_state/candidate_document/actions';

import {
  clientExportPdfAction,
  clearExportPdfAction
} from '../common_provider/export_candidate_report_pdf/actions';

import {
  makeSelectExportCandidateReportPdfLoading,
  makeSelectExportCandidateReportPdfError,
  makeSelectExportCandidateReportPdfResponse
} from '../common_provider/export_candidate_report_pdf/selectors';

import CandidateMainReport from 'components/layout/CandidateMainReport';
import SpinnerLoading from 'components/SpinnerLoading';
import ClientLayout from 'components/layout/Client/ClientLayout';
import { openNotification } from 'utils/notification';
import { Modal } from 'antd';
import reducer from './reducer';

import { CONFIG } from 'constants/config';
import useSocket from 'use-socket.io-client';
import { ContentModal } from '../../components/modals/ContentModal'

import { Row, Col, DatePicker, TimePicker, Checkbox, Input } from 'antd';
import moment from 'moment';
import ModalCustom from 'components/ModalCustom';
import ButtonCustom from 'components/atoms/Button';
import { PlusOutlined } from '@ant-design/icons';
import * as jobService from 'services/api/jobService';

import ActionType from 'components/TableCustom/ActionType';
import { FieldArray, Formik } from 'formik';
import * as Yup from 'yup';
import { Form } from 'formik-antd';

const server = CONFIG.SERVER;
const NOTIFICATION_TYPES = CONFIG.NOTIFICATION_TYPES;

export function ClientCandidateReport(props) {
  useInjectReducer({ key: 'clientcandidatereport', reducer });

  const {
    history,
    location,
    match,
    loadingCandidate,
    candidateInfo,
    errorCandidate,
    onGetCandidateReport,
    onClientFeedback,
    onUpdateFeedback,
    updateFeebackResponse,
    updateFeedbackError,
    onGetFeedback,
    getFeedbackResponse,
    loadingFeedback,
    onDownloadDocument,
    download,
    errorDownload,
    loadingDownload,
    clearAll,
    onAssessmentDownload,
    assessmentDownload,
    assessmentDownloadLoading,
    assessmentDownloadError,
    clearAssessmentDownload,
    onExportCandidatePdf,
    clearExportPdf,
    exportResponse,
    exportError,
    exportLoading,
  } = props;

  const [feedback, setFeedback] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [timeDelete, setTimeDelete] = useState([]);
  const [socket] = useSocket(server);

  const inviteToken = useMemo(() => {
    return match?.params?.invite_token;
  }, [match?.params?.invite_token]);

  const jobType = useMemo(() => {
    return location?.state?.jobType;
  }, [location?.state?.jobType]);

  const candidate = useMemo(() => {
    return location?.state?.candidate;
  }, [location?.state?.candidate]);

  const companyLogo = useMemo(() => {
    return location?.state?.companyLogo;
  }, [location?.state?.companyLogo]);

  const recruiterId = useMemo(() => {
    return location?.state?.recruiterId;
  }, [location?.state?.recruiterId]);

  const jobClientContact = useMemo(() => {
    return location?.state?.jobClientContact;
  }, [location?.state?.jobClientContact]);

  const jobTitle = useMemo(() => {
    return location?.state?.jobTitle;
  }, [location?.state?.jobTitle]);

  const color = useMemo(() => {
    return location?.state?.color;
  }, [location?.state?.color]);

  const onFeedback = data => {
    onClientFeedback(inviteToken, data);
  };

  const handleRedirectNotFound = () => {
    history.push({
      pathname: '/not-found',
      state: {
        isNotBackHome: true,
      },
    })
  }

  const handleDownloadDoc = doc => {
    onDownloadDocument(inviteToken, doc);
  };

  const handleDownloadAssessment = (assessmentId) => {
    onAssessmentDownload(assessmentId);
  };

  const handleExportToPdf = (data) => {
    const params = {
      candidate_id: data?.candidate_id,
      invite_token: inviteToken,
      agency_id: location?.state?.inviteToken,
      client_contact_id: jobClientContact?.client_contact_id
    };
    onExportCandidatePdf(params);
  }

  useEffect(() => {
    if (!inviteToken || !candidate) {
      handleRedirectNotFound();
    } else {
      getDateTimeInterviewOfCandidate(candidate);
      onGetCandidateReport(inviteToken, candidate.id);
      onGetFeedback(inviteToken, candidate.id);
    }
  }, [candidate, inviteToken,toggleInterviewModal]);

  useEffect(() => {
    if (updateFeebackResponse) {
      socket.emit("clientSendNotification", {
        sender_id: jobClientContact.client_id,
        receiver_id: recruiterId,
        type: NOTIFICATION_TYPES.CLIENT_PROVIDED_FEEDBACK_ON_CANDIDATE_REPORTS,
        title: 'Feedback provided on your candidate reports',
        content: `<div><span class="notification-content-highlight">${jobClientContact.first_name} ${jobClientContact.last_name}</span> has provided feedback on the candidate reports for <span class="notification-content-highlight">${jobTitle}</span>. Please view</div>`
      })
      setFeedback(updateFeebackResponse);
      localStorage.setItem(updateFeebackResponse?.candidate_id, updateFeebackResponse?.id);
      Modal.success({
        centered: true,
        title: false,
        icon: false,
        className: 'nem-modal-confirm',
        content: (
          <ContentModal
            title={<FormattedMessage {...messages.feedbackSuccessTitle} />}
            message={<FormattedMessage {...messages.feedbackSuccessMessage} />}
            isSuccess={true}
          />
        ),
        okText: <FormattedMessage {...messages.buttonDone} />,
      });
    }
  }, [updateFeebackResponse]);

  useEffect(() => {
    if (getFeedbackResponse) {
      const feedback_list = getFeedbackResponse?.feedback_list || [];
      const feedbackId = localStorage.getItem(candidateInfo?.id)
      const lastFeedback = feedback_list.find((feedback) => feedback?.id === feedbackId)
      setFeedback(lastFeedback || null);
    }
  }, [getFeedbackResponse, candidateInfo?.id]);

  useEffect(() => {
    if (errorCandidate) {
      handleRedirectNotFound();
    }
  }, [errorCandidate]);

  useEffect(() => {
    if (updateFeedbackError) {
      if (updateFeedbackError?.payload) {
        Modal.confirm({
          centered: true,
          title: false,
          icon: false,
          className: 'nem-modal-confirm',
          content: (
            <ContentModal
              title={<FormattedMessage {...messages.confirmTitle} />}
              message={<FormattedMessage {...messages.confirmMessage} />}
            />
          ),
          okText: <FormattedMessage {...messages.buttonYes} />,
          cancelText: <FormattedMessage {...messages.buttonNo} />,
          onOk() {
            onUpdateFeedback(inviteToken, updateFeedbackError?.payload)
          }
        });
      } else {
        openNotification('error', updateFeedbackError?.message);
      }
    }
    if (assessmentDownloadError || errorDownload) {
      openNotification('error', 'Download Faild!');
    }
  }, [updateFeedbackError, errorDownload, assessmentDownloadError]);

  useEffect(() => {
    if (download) {
      const fileURL = window.URL.createObjectURL(download?.data);
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', download?.fileName);
      document.body.appendChild(fileLink);
      fileLink.click();
      clearAssessmentDownload();
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
      cleanAllStateDocument();
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
      openNotification('error', exportError?.message || 'Export failed.');
    }
  }, [exportError]);

  useEffect(() => {
    let isLoading = loadingCandidate || loadingDownload || assessmentDownloadLoading || exportLoading || loadingFeedback;
    setIsLoading(isLoading);
  }, [loadingCandidate, loadingDownload, assessmentDownloadLoading, exportLoading, loadingFeedback]);

  useEffect(() => {
    socket.connect();
    return () => {
      clearAll();
      clearExportPdfAction();
      clearAssessmentDownload();
      socket.disconnect();
    }
  }, []);

  const initValueAddInterview = {
    apply_to_all: true,
    info: '',
    interviewList: [
      {
        date: undefined,
        time_start: undefined,
        time_end: undefined,
        id: '',
      },
    ],
  };

  // Interview
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const schema = Yup.object().shape({
    id: Yup.string(),
    apply_to_all: Yup.bool().required(),
    info: Yup.string(),
    interviewList: Yup.array().of(
      Yup.object().shape({
        date: Yup.date()
          .label('Date')
          .required('Please enter date')
          .when(
            'id',
            (id, schema) =>
              !id ?
                schema.min(yesterday, 'Date must be more than now') : schema,
          ),
        time_start: Yup.date()
          .label('From')
          .required('Please enter time start'),
        time_end: Yup.date()
          .label('To')
          .required('Please enter time end')
          .when(
            'time_start',
            (time_start, schema) =>
              time_start &&
              schema.min(time_start, "Time start can't be before time end"),
          ),
      }),
    ),
  });

  const [toggleInterviewModal, setToggleInterviewModal] = useState(false);
  const [interviews, setInterviews] = useState(initValueAddInterview);
  const [isRefresh, setIsRefresh] = useState(false);

  const formInterviewRef = useRef(null);

  const getDateTimeInterviewOfCandidate = async candidate => {
    try {
      const result = await jobService.getDateInterviewOfCandidate(
        candidate.job_id,
        candidate.id,
      );
      if (!result || result.data.length) {
        setInterviews({
          interviewList: result.data,
          info: !!result && result.data.length && result.data[0].info,
          apply_to_all: true,
        });
      } else {
        setInterviews(initValueAddInterview);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openInterViewModel = async () => {
    if (candidate && isRefresh) {
      await getDateTimeInterviewOfCandidate(candidate);
    }
    setToggleInterviewModal(true);
  };

  const showInterviewModal = () => {
    setToggleInterviewModal(true);
  };

  const handleInterviewSubmit = () => {
    formInterviewRef.current?.handleSubmit();
  };

  const handleInterviewCancel = e => {
    setToggleInterviewModal(false);
    formInterviewRef.current?.resetForm();
  };

  const onInterviewFinish = async values => {
    const payload = {
      interview_time: values?.interviewList.filter(x => !x.id),
      apply_to_all: values.apply_to_all,
      info: values.info,
      candidate_id: [candidate?.id],
    };
    try {
      await jobService.createDateInterview(inviteToken, candidate?.job_id, payload);
        if(timeDelete.length !== 0){
          await jobService.deleteInterviewOfCandidates(
           { "time": timeDelete },
          );
        } 
      setIsRefresh(true);
    } catch (error) {
      console.log(error);
      setIsRefresh(false);
    }

    formInterviewRef.current?.resetForm();
    setToggleInterviewModal(false);
    window.location.reload();
  };

  const deleteInterview = id => {
    let arrayTime = timeDelete
    arrayTime.push(id)
    setTimeDelete(arrayTime)
  };

  const setFieldChange = (value, fieldName, setFieldValue) => {
    if (value === false) {
      setFieldValue(fieldName, value);
    } else {
      setFieldValue(fieldName, !!value ? value : undefined);
    }
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current <= moment().endOf('day');
  }

  const { TextArea } = Input;

  const AddInterViewModal = ({ record }) => (
    <ModalCustom
      width={1100}
      showModal={showInterviewModal}
      toggleModal={toggleInterviewModal}
      handleOk={handleInterviewSubmit}
      handleCancel={handleInterviewCancel}
      wrapClassName={`create-interview-modal`}
      title={
        <span className={`text-22-bold add-client`}>
          <FormattedMessage {...messages.interviewTime} />
        </span>
      }
      footer={[
        <Row gutter={[8, 0]} justify="center" key="add_client">
          <Col>
            <ButtonCustom
              case="static"
              className="btn-danger btn-77-40"
              onClick={handleInterviewCancel}
            >
              <FormattedMessage {...messages.cancel} />
            </ButtonCustom>
          </Col>
          <Col>
            <ButtonCustom
              className="btn-primary-gradient btn-140-40"
              type="submit"
              onClick={handleInterviewSubmit}
            >
              <FormattedMessage {...messages.saveAndSubmit} />
            </ButtonCustom>
          </Col>
        </Row>,
      ]}
    >
      <Formik
        initialValues={interviews}
        innerRef={formInterviewRef}
        validationSchema={schema}
        onSubmit={onInterviewFinish}
      >
        {({ values, setFieldValue }) => (
          <>
            <Form layout="vertical" className={'add-contact-form'}>
              <FieldArray name="interviewList">
                {({ push, remove }) => (
                  <>
                    <div className={`recruiter-wrapper-scroll`}>
                      <Row
                        gutter={[24, 0]}
                        justify="space-between"
                        align="center"
                        className={`recruiter-row`}
                      >
                        <Col xs={12}>
                          <Form.Item
                            label=""
                            hasFeedback={true}
                            showValidateSuccess={true}
                            name={`apply_to_all`}
                          >
                            <Checkbox
                              style={{ fontSize: 14 }}
                              name="apply_to_all"
                              checked={true}
                              defaultChecked={values.apply_to_all}
                              onChange={event =>
                                setFieldChange(
                                  event.target.checked,
                                  `apply_to_all`,
                                  setFieldValue,
                                )
                              }
                            >
                              Apply to all candidates
                            </Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row
                        style={{ marginTop: 15 }}
                        gutter={[24, 0]}
                        justify="space-between"
                        align="center"
                        className={`recruiter-row`}
                      >
                        <Col xs={24}>
                          <label
                            style={{
                              fontWeight: '700',
                              fontSize: 12,
                              color: '#888888',
                            }}
                          >
                            Additional Information
                          </label>
                          <TextArea
                            style={{ marginTop: 5 }}
                            name="info"
                            placeholder="E.g: Interview address"
                            defaultValue={values.info}
                            rows={4}
                            onChange={event =>
                              setFieldChange(
                                event.target.value,
                                `info`,
                                setFieldValue,
                              )
                            }
                          />
                        </Col>
                      </Row>
                      <div style={{ marginTop: 15 }}>
                        <label
                          style={{
                            fontWeight: '700',
                            fontSize: 12,
                            color: '#888888',
                          }}
                        >
                          Choose Available Date Time
                        </label>
                        {values.interviewList &&
                          values.interviewList?.map((interview, index) => (
                            <div
                              style={{ marginTop: 5 }}
                              key={index}
                              className={`recruiter-list`}
                            >
                              <Row
                                gutter={[32, 0]}
                                justify="space-between"
                                align="center"
                                className={`recruiter-row`}
                              >
                                <Col xs={24} sm={12} lg={6}>
                                  <Form.Item
                                    hasFeedback={true}
                                    label="DATE"
                                    showValidateSuccess={true}
                                    name={`interviewList[${index}].date`}
                                  >
                                    <DatePicker
                                      disabledDate={disabledDate}
                                      disabled={interview.id}
                                      format="DD/MM/YYYY"
                                      getPopupContainer={trigger =>
                                        trigger.parentNode
                                      }
                                      value={
                                        interview.date
                                          ? moment(interview.date)
                                          : undefined
                                      }
                                      style={{ width: '100%' }}
                                      name={`interviewList[${index}].date`}
                                      onChange={value =>
                                        setFieldChange(
                                          value,
                                          `interviewList[${index}].date`,
                                          setFieldValue,
                                        )
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} lg={6}>
                                  <Form.Item
                                    label="FROM"
                                    hasFeedback={true}
                                    showValidateSuccess={true}
                                    name={`interviewList[${index}].time_start`}
                                  >
                                    <TimePicker
                                      disabled={interview.id}
                                      getPopupContainer={trigger =>
                                        trigger.parentNode
                                      }
                                      format='h:mm a'
                                      style={{ width: '100%' }}
                                      name={`interviewList[${index}].time_start`}
                                      value={
                                        interview.time_start
                                          ? moment(interview.time_start)
                                          : undefined
                                      }
                                      onChange={value =>
                                        setFieldChange(
                                          value,
                                          `interviewList[${index}].time_start`,
                                          setFieldValue,
                                        )
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} lg={6}>
                                  <Form.Item
                                    hasFeedback={true}
                                    label="TO"
                                    showValidateSuccess={true}
                                    showInitialErrorAfterTouched={true}
                                    name={`interviewList[${index}].time_end`}
                                  >
                                    <TimePicker
                                      disabled={interview.id}
                                      getPopupContainer={trigger =>
                                        trigger.parentNode
                                      }
                                      style={{ width: '100%' }}
                                      name={`interviewList[${index}].time_end`}
                                      format='h:mm a'
                                      value={
                                        interview.time_end
                                          ? moment(interview.time_end)
                                          : undefined
                                      }
                                      onChange={value =>
                                        setFieldChange(
                                          value,
                                          `interviewList[${index}].time_end`,
                                          setFieldValue,
                                        )
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col
                                  style={{ display: 'flex' }}
                                  xs={24}
                                  sm={2}
                                  lg={2}
                                >
                                  <ActionType
                                    onClick={() => {
                                      remove(index);
                                      if (interview?.id)
                                        deleteInterview(interview?.id);
                                    }}
                                    type="delete"
                                  />
                                </Col>
                              </Row>
                            </div>
                          ))}
                      </div>

                      <ButtonCustom
                        style={{ marginTop: 10 }}
                        className="btn-default-outline"
                        type="button"
                        onClick={() => {
                          push({
                            date: undefined,
                            time_start: undefined,
                            time_end: undefined,
                            id: '',
                          });
                        }}
                      >
                        <PlusOutlined className="icon-btn" />
                        Add more
                      </ButtonCustom>
                    </div>
                  </>
                )}
              </FieldArray>
            </Form>
          </>
        )}
      </Formik>
    </ModalCustom>
  );

  return (
    <div>
      <Helmet>
        <title>Client - Candidate Report</title>
        <meta
          name="description"
          content="Description of Client candidate report"
        />
      </Helmet>
      {isLoading && <SpinnerLoading loading={isLoading} />}
      {!isLoading && candidateInfo && (
        <ClientLayout
          className="client-layout"
          logo={companyLogo}
          history={history}
          inviteToken={inviteToken}
          fontColor={color}
          jobType={jobType}
        >
          <CandidateMainReport
            contactInfo={jobClientContact}
            candidateInfo={candidateInfo}
            jobType={jobType}
            classNames={
              {
                buttonColor: '#6893ff',
                linkColor: '#6893ff',
                radarColor: '#462851',
              }
            }
            onFeedback={onFeedback}
            onInterview={() => openInterViewModel()}
            interviewStatus={candidate.interview_status}
            feedback={feedback}
            disableSubmit={false}
            onDownload={handleDownloadDoc}
            onDownloadAssessment={handleDownloadAssessment}
            onExport={handleExportToPdf}
            clientReview={true}
          />

          <AddInterViewModal />
        </ClientLayout>
      )}
    </div>
  );
}

ClientCandidateReport.propTypes = {
  loadingCandidate: PropTypes.bool,
  candidateInfo: PropTypes.object,
  errorCandidate: PropTypes.object,
  onGetCandidateReport: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
  onClientFeedback: PropTypes.func,
  onUpdateFeedback: PropTypes.func,
  updateFeebackResponse: PropTypes.object,
  updateFeedbackError: PropTypes.object,
  onGetFeedback: PropTypes.func,
  getFeedbackResponse: PropTypes.object,
  onDownloadDocument: PropTypes.func,
  download: PropTypes.object,
  errorDownload: PropTypes.bool,
  loadingDownload: PropTypes.bool,
  clearAll: PropTypes.func,
  exportResponse: PropTypes.object,
  exportError: PropTypes.object,
  exportLoading: PropTypes.bool,
  clearAssessmentDownload: PropTypes.func,
  onExportCandidatePdf: PropTypes.func,
  clearExportPdf: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  loadingCandidate: makeSelectClientCandidateReportLoading(),
  candidateInfo: makeSelectClientCandidateReportSuccess(),
  errorCandidate: makeSelectClientCandidateReportError(),
  updateFeebackResponse: makeSelectUpdateFeedbackSuccess(),
  updateFeedbackError: makeSelectUpdateFeedbackError(),
  getFeedbackResponse: makeSelectGetClientFeedbackSuccess(),
  getFeedbackError: makeSelectGetClientFeedbackError(),
  loadingFeedback: makeSelectGetClientFeedbackloading(),
  download: makeSelectDownloadDocumentSuccess(),
  loadingDownload: makeSelectDownloadDocumentLoading(),
  errorDownload: makeSelectDownloadDocumentError(),
  assessmentDownload: makeSelectDownloadAssessmentSuccess(),
  assessmentDownloadLoading: makeSelectDownloadAssessmentLoading(),
  assessmentDownloadError: makeSelectDownloadAssessmentError(),
  exportResponse: makeSelectExportCandidateReportPdfResponse(),
  exportError: makeSelectExportCandidateReportPdfError(),
  exportLoading: makeSelectExportCandidateReportPdfLoading()
});

function mapDispatchToProps(dispatch) {
  return {
    onGetCandidateReport: (invite_token, candidateId) => {
      dispatch(getCandidateReportAction(invite_token, candidateId));
    },
    onClientFeedback: (invite_token, data) => {
      dispatch(createClientFeedbackAction(invite_token, data));
    },
    onUpdateFeedback: (invite_token, data) => {
      dispatch(updateClientFeedbackAction(invite_token, data));
    },
    onGetFeedback: (inviteToken, candidateId) => {
      dispatch(getClientFeedbackAction(inviteToken, candidateId));
    },
    onDownloadDocument: (inviteToken, doc) => {
      dispatch(downloadDocumentsAction(inviteToken, doc));
    },
    onAssessmentDownload: (assessmentId) => {
      dispatch(downloadAssessmentReportAction(assessmentId))
    },
    clearAssessmentDownload: () => {
      dispatch(cleanAllStateDocument())
    },
    clearAll: () => {
      dispatch(clearAllAction())
    },
    onExportCandidatePdf: (params) => dispatch(clientExportPdfAction(params)),
    clearExportPdf: () => dispatch(clearExportPdfAction()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ClientCandidateReport);
