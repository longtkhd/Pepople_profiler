/**
 *
 * ClientJobDashboard
 *
 */

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { openNotification } from 'utils/notification';
import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';
import messages from '../table_reuse/messages';
import ActionType from 'components/TableCustom/ActionType';
import InputCustom from 'components/InputCustom';
import {
  makeSelectClientJobDashboardError,
  makeSelectClientJobDashboardLoading,
  makeSelectClientJobDashboardSuccess,
} from './selectors';

import { getClientJobDashboardAction } from './actions';

import {
  makeSelectCompanyBackgroundSuccess,
  makeSelectCompanyLogoSuccess,
  makeSelectGetCompanyBackgroundLoading,
  makeSelectGetCompanyLogoLoading,
} from '../common_provider/get_agency_info/selectors';

import {
  clientExportPdfAction,
  clearExportPdfAction,
} from '../common_provider/export_candidate_report_pdf/actions';

import {
  makeSelectExportCandidateReportPdfLoading,
  makeSelectExportCandidateReportPdfError,
  makeSelectExportCandidateReportPdfResponse,
} from '../common_provider/export_candidate_report_pdf/selectors';

import {
  getCompanyBackground,
  getCompanyLogo,
} from '../common_provider/get_agency_info/actions';

import { Button } from 'antd';
import ClientLayout from 'components/layout/Client/ClientLayout';
import './styles.less';
import ShortlistedCandidates from 'components/ShortlistedCandidates';
import CardActivity from 'components/CardActivity';
import TableCustom from 'components/TableCustom';
import FormInfoDetail from 'components/FormInfoDetail';
import ModalCustom from 'components/ModalCustom';
import {
  FilePdfOutlined,
  EyeOutlined,
  StarOutlined,
  MessageOutlined,
  WechatOutlined,
} from '@ant-design/icons';

import { Row, Col, DatePicker, TimePicker, Checkbox, Input } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import SpinnerLoading from '../../components/SpinnerLoading';

import {
  clientExportPdfAction as clientExportJobPdfAction,
  clearExportPdfAction as clearJobExportAction
} from 'containers/common_provider/export_job_activity_report_pdf/actions';

import {
  makeSelectExportJobActivityReportPdfLoading,
  makeSelectExportJobActivityReportPdfError,
  makeSelectExportJobActivityReportPdfResponse
} from 'containers/common_provider/export_job_activity_report_pdf/selectors';


import { CONFIG } from 'constants/config';
import useSocket from 'use-socket.io-client';
import NumberFormat from 'react-number-format';
import ButtonCustom from 'components/atoms/Button';
import { PlusOutlined } from '@ant-design/icons';
import { AutoComplete } from 'formik-antd';
import * as jobService from 'services/api/jobService';

import { FieldArray, Formik } from 'formik';
import * as Yup from 'yup';
import { Form } from 'formik-antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faSpinner } from '@fortawesome/free-solid-svg-icons';

const server = CONFIG.SERVER;
const NOTIFICATION_TYPES = CONFIG.NOTIFICATION_TYPES;
const moment_time_zone = require('moment-timezone')
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

export function ClientJobDashboard(props) {
  useInjectReducer({ key: 'clientJobDashboard', reducer });

  const {
    history,
    match,
    dashboardLoading,
    dashboardDetail,
    dashboardError,
    onGetClientJobDashboardDetail,
    companyLogo,
    companyLogoLoading,
    onGetCompanyLogo,
    onExportCandidatePdf,
    clearExportPdf,
    exportResponse,
    exportError,
    exportLoading,
    exportJobResponse,
    exportJobError,
    exportJobLoading,
    clearJobExportAction,
    clientExportJobPdfAction
  } = props;

  const initValueAddInterview = {
    apply_to_all: true,
    info: '',
    interviewList: [
      {
        date: undefined,
        time_start: undefined,
        time_end: undefined,
        id: '',
        time_zone: moment_time_zone.tz.guess()
      },
    ],
  };

  const [selectedCandidate, setSelectedCandidate] = useState(undefined);
  const [toggleInterviewModal, setToggleInterviewModal] = useState(false);
  const [interviews, setInterviews] = useState(initValueAddInterview);
  const [timeDelete, setTimeDelete] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fontColor, setFontColor] = useState('#1e1e2d');
  const [socket] = useSocket(server);
  const jobType = dashboardDetail?.job_detail?.work_type;

  const formInterviewRef = useRef(null);

  const inviteToken = useMemo(() => {
    return match?.params?.invite_token;
  }, [match?.params?.invite_token]);

  const handleExportJobToPdf = () => {
    clientExportJobPdfAction(inviteToken);
  }

  useEffect(() => {
    if (exportJobResponse) {
      const fileURL = window.URL.createObjectURL(exportJobResponse?.data);
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', exportJobResponse?.fileName);
      document.body.appendChild(fileLink);
      fileLink.click();
      clearJobExportAction();
    }
  }, [exportJobResponse]);



  useEffect(() => {
    if (exportJobError) {
      openNotification('error', exportJobError?.message || 'Export faild.');
      clearExportPdfAction();
    }
  }, [exportJobError]);

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

  const handleRedirectToCandidate = r => {
    history.push({
      pathname: `/client-candidate-report/${inviteToken}`,
      state: {
        candidate: r,
        contactName: shortlisted?.first_name,
        companyLogo: companyLogo,
        agency_id: dashboardDetail?.agency_id,
        recruiterId: dashboardDetail?.job_detail?.created_by,
        jobTitle: dashboardDetail?.job_detail?.job_title,
        jobClientContact: dashboardDetail?.job_client_contact,
        color: fontColor,
        jobType: jobType,
      },
    });
  };

  const CandidateColumns = [
    {
      title: 'Name',
      dataIndex: 'candidate_name',
      key: '1',
    },
    {
      title: 'Notice Period',
      dataIndex: 'notice_period',
      key: '2',
    },
    {
      title: 'Current Position',
      dataIndex: 'current_position',
      key: '3',
    },
    {
      title: 'Current Employer',
      dataIndex: 'current_employer',
      key: '4',
    },
    {
      title: 'exp. rem',
      dataIndex: 'exp_rem',
      key: '5',
      render: (_, record) => {
        return (
          <span>
            {jobType === "Temp" ?
              <>{record?.exp_rem}</> :
              <NumberFormat
                placeholder=""
                prefix="AUD $"
                thousandSeparator={true}
                displayType={'text'}
                value={record?.exp_rem}
              />
            }
          </span>
        );
      },
    },
    {
      title: 'ACTIONS',
      dataIndex: 'actions',
      key: '6',
      render: (_, record) => (
        <Row justify="end" gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={4}>
            <Link
              className={`link link-view`}
              to={{
                pathname: `/client-candidate-report/${inviteToken}`,
                state: {
                  candidate: record,
                  contactName: shortlisted?.first_name,
                  companyLogo: companyLogo,
                  agency_id: dashboardDetail?.agency_id,
                  recruiterId: dashboardDetail?.job_detail?.created_by,
                  jobTitle: dashboardDetail?.job_detail?.job_title,
                  jobClientContact: dashboardDetail?.job_client_contact,
                  color: fontColor,
                  jobType: jobType,
                },
              }}
            >
              <EyeOutlined className={'link-icon'} /> View
            </Link>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={6}>
            <Link
              to="#"
              className={`link ${record?.status === 1 ? 'link-active-interested' : null
                }`}
            >
              <StarOutlined className={'link-icon'} /> Interested
            </Link>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={8} style={{ padding: '0' }}>
            <Link
              to="#"
              className={`link link-discus ${record?.status === 2 ? 'link-active-discus' : null
                }`}
            >
              <MessageOutlined className={'link-icon'} /> Let’s discuss
            </Link>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={6} style={{ padding: '0' }}>
            {
              !record.interview_status || record.interview_status === 0 ?
                <span
                  style={{ cursor: 'pointer', color: 'gray', fontSize: 12 }}
                  onClick={() => openInterViewModel(record)}
                >
                  <FontAwesomeIcon style={{ marginLeft: 5, paddingRight: 5, fontSize: 16 }} icon={faComments} />
                  Interview
                </span> : null
            }

            {
              record.interview_status === 1 ?
                <span
                  style={{ cursor: 'pointer', color: '#ffa900', fontSize: 12 }}
                  onClick={() => openInterViewModel(record)}
                >
                  <FontAwesomeIcon style={{ marginLeft: 5, paddingRight: 5, fontSize: 16 }} icon={faSpinner} />
                  Interview
                </span> : null
            }

            {
              record.interview_status === 2 ?
                <span
                  style={{
                    cursor: 'pointer',
                    color: 'white',
                    background: '#87cb16',
                    padding: 3,
                    paddingLeft: 5,
                    paddingRight: 5,
                    borderRadius: 15,
                    fontSize: 12
                  }}
                  onClick={() => openInterViewModel(record)}
                >
                  <FontAwesomeIcon style={{ marginLeft: 5, paddingRight: 5, fontSize: 16 }} icon={faComments} />
                  Interview
                </span> : null
            }

          </Col>
        </Row>
      ),
      width: '37%',
    },
  ];

  const openInterViewModel = async record => {
    setSelectedCandidate(record);
    await getDateTimeInterviewOfCandidate(record);
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
      candidate_id: [selectedCandidate?.id],
    };
    try {
      await jobService.createDateInterview(inviteToken, selectedCandidate?.job_id, payload);
      if(timeDelete.length !== 0){
         await jobService.deleteInterviewOfCandidates(
          { "time": timeDelete },
        );
      } 
    } catch (error) {
      console.log(error);
    }

    formInterviewRef.current?.resetForm();
     onGetClientJobDashboardDetail(inviteToken);
     setToggleInterviewModal(false);
  };

  const deleteInterview = async id => {
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
    return current && current < moment(yesterday).endOf('day');
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
              className="btn-primary-gradient btn-145-40"
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
                              defaultChecked={values.apply_to_all}
                              checked={true}
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
                                      getPopupContainer={trigger => trigger.parentNode}
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
                                      style={{ width: '100%' }}
                                      name={`interviewList[${index}].time_start`}
                                      format='h:mm a'
                                      getPopupContainer={trigger => trigger.parentNode}
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
                                      style={{ width: '100%' }}
                                      getPopupContainer={trigger => trigger.parentNode}
                                      format='h:mm a'
                                      name={`interviewList[${index}].time_end`}
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
                                      console.log(index)
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

  const handleRedirectNotFound = () => {
    history.push({
      pathname: '/not-found',
      state: {
        isNotBackHome: true,
      },
    });
  };

  const shortlisted = useMemo(() => {
    const application_count = dashboardDetail?.job_detail?.recruitment_activity.find(
      r => {
        return r.icon == '0';
      },
    );
    return {
      first_name: dashboardDetail?.job_client_contact?.first_name,
      last_name: dashboardDetail?.job_client_contact?.last_name,
      client_id: dashboardDetail?.job_client_contact?.client_id,
      recruiter_id: dashboardDetail?.job_detail?.created_by,
      job_title: dashboardDetail?.job_detail?.job_title,
      business_name: dashboardDetail?.job_detail?.business_name,
      person_in_charge: dashboardDetail?.job_detail?.person_in_charge,
      agency_name: dashboardDetail?.agency?.agency_name,
      phone_number: dashboardDetail?.job_detail?.phone_number,
      application_count: application_count?.value,
    };
  }, [dashboardDetail]);

  const candidateData = useMemo(() => {
    const candidateList = dashboardDetail?.candidate_list;
    if (candidateList) {
      const data = candidateList.map(candidate => {
        return { key: candidate?.id, interview_status: dashboardDetail?.job_client_contact.interview_status, ...candidate };
      });
      return data;
    }
    return null;
  }, [dashboardDetail]);

  const handleExportToPdf = useCallback(() => {
    if (!candidateData) return;
    const listId = candidateData.map(cadidate => cadidate.id);
    const params = {
      candidate_id: listId,
      invite_token: inviteToken,
      agency_id: dashboardDetail?.agency_id,
      client_contact_id: dashboardDetail?.job_client_contact?.client_contact_id,
    };
    onExportCandidatePdf(params);
  }, [candidateData, dashboardDetail]);

  const recruitmentActivity = useMemo(() => {
    const list = dashboardDetail?.job_detail?.recruitment_activity;
    if (!list) return [];
    return list;
  }, [dashboardDetail?.job_detail]);

  const reason = useMemo(() => {
    const list = dashboardDetail?.job_detail?.recruitment_activity;
    if (!list) return '';
    return list.find(x => x.icon == 7);
  }, [dashboardDetail?.job_detail]);

  useEffect(() => {
    if (inviteToken) {
      onGetClientJobDashboardDetail(inviteToken);
    }
  }, [inviteToken]);

  useEffect(() => {
    if (dashboardError) {
      handleRedirectNotFound();
    }
  }, [dashboardError]);

  useEffect(() => {
    const companyInfo = dashboardDetail?.company_info;
    const agency_id = dashboardDetail?.agency_id;
    if (companyInfo) {
      setFontColor(companyInfo?.font_color);
    }
    if (jobType === 'Contract') {
      setFontColor('#838892');
    }
    if (companyInfo?.logo && agency_id) {
      onGetCompanyLogo(agency_id, companyInfo.logo, 'logo');
    }
  }, [dashboardDetail?.company_info, dashboardDetail?.agency_id]);

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
      openNotification('error', exportError?.message || 'Export faild.');
    }
  }, [exportError]);

  useEffect(() => {
    const loading = companyLogoLoading || dashboardLoading || exportLoading || exportJobLoading;
    setLoading(loading);
  }, [companyLogoLoading, dashboardLoading, exportLoading, exportJobLoading]);

  // useEffect(() => {
  //   if (shortlisted) {
  //     socket.emit('clientSendNotification', {
  //       sender_id: shortlisted.client_id,
  //       receiver_id: shortlisted.recruiter_id,
  //       type: NOTIFICATION_TYPES.CLIENT_HAS_VIEWD_CANDIDATE_REPORT,
  //       title: 'Candidate reports viewed',
  //       content: `<div><span class="notification-content-highlight">${
  //         shortlisted.first_name
  //       } ${
  //         shortlisted.last_name
  //       }</span> has viewed the candidate reports of <span class="notification-content-highlight">${
  //         shortlisted.job_title
  //       }</span>.</div>`,
  //     });
  //   }
  //   return () => {};
  // }, [shortlisted]);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) return <SpinnerLoading loading={loading} />;

  return (
    <div>
      <Helmet>
        <title>Client - Job Dashboard</title>
        <meta name="description" content="Description of ClientJobDashboard" />
      </Helmet>
      <ClientLayout
        className="client-layout"
        logo={companyLogo}
        fontColor={fontColor}
        jobType={jobType}
      >
        <div
          className="content-short-list"
          style={{ color: `#32363e !important` }}
        >
          <ShortlistedCandidates data={shortlisted} />

          {dashboardDetail?.job_detail?.exclude_from_report == false &&
            recruitmentActivity.length > 0 && (
              <FormInfoDetail title="Recruitment Activity"
                actions={
                  <Row className="action-group" gutter={[8, 0]}>
                    <Col>
                      <ButtonCustom
                        className="btn-primary-gradient"
                        type="button"
                        onClick={() => handleExportJobToPdf()}
                      >
                        <FormattedMessage {...messages.download_activity_report} />
                      </ButtonCustom>
                    </Col>
                  </Row>
                }
              >
                <div className="activity-card-main">
                  <Row justify="start" gutter={[8, 32]}>
                    {recruitmentActivity.map(item => {
                      if (item?.icon == '5') {
                        if (item?.value?.male || item?.value?.male) {
                          return (
                            <Col xl={8} xs={24} sm={24} lg={12} key={item?.key}>
                              <CardActivity
                                value={item?.value}
                                icon={item?.icon}
                                title={item?.key}
                              />
                            </Col>
                          );
                        }
                      } else {
                        return (
                          item?.key &&
                          item?.value && (
                            <Col xl={8} xs={24} sm={24} lg={12} key={item?.key}>
                              <CardActivity
                                value={item?.value}
                                icon={item?.icon}
                                title={item?.key}
                                description={
                                  item?.icon == '6' ? reason?.value : ''
                                }
                              />
                            </Col>
                          )
                        );
                      }
                    })}
                  </Row>
                </div>
              </FormInfoDetail>
            )}
        </div>
        {candidateData && candidateData?.length > 0 && (
          <div className="content-short-list table-short-list">
            <FormInfoDetail title={'Shortlisted Candidates'}>
              <TableCustom
                dataSource={candidateData}
                columns={CandidateColumns}
                pagination={false}
                className={'table-shortlist'}
                scroll={{
                  x: 800,
                }}
                onRow={r => ({
                  // onClick: () => (handleRedirectToCandidate(r))
                })}
              />
              <div className="pdf-button">
                <Button
                  icon={<FilePdfOutlined />}
                  style={{
                    fontWeight: 'bold',
                    marginTop: '20px',
                  }}
                  onClick={handleExportToPdf}
                >
                  Export to PDF
                </Button>
              </div>
            </FormInfoDetail>
          </div>
        )}
      </ClientLayout>

      <AddInterViewModal />
    </div>
  );
}

ClientJobDashboard.propTypes = {
  dashboardLoading: PropTypes.bool,
  dashboardDetail: PropTypes.object,
  dashboardError: PropTypes.object,
  companyLogo: PropTypes.object,
  companyLogoLoading: PropTypes.bool,
  exportResponse: PropTypes.object,
  exportLoading: PropTypes.bool,
  exportError: PropTypes.object,
  onGetClientJobDashboardDetail: PropTypes.func,
  onGetCompanyLogo: PropTypes.func,
  clearExportPdf: PropTypes.func,
  exportJobResponse: PropTypes.object,
  exportJobError: PropTypes.object,
  exportJobLoading: PropTypes.bool,
  clearJobExportAction: PropTypes.any,
  clientExportJobPdfAction: PropTypes.any
};

const mapStateToProps = createStructuredSelector({
  dashboardLoading: makeSelectClientJobDashboardLoading(),
  dashboardDetail: makeSelectClientJobDashboardSuccess(),
  dashboardError: makeSelectClientJobDashboardError(),
  companyLogo: makeSelectCompanyLogoSuccess(),
  companyLogoLoading: makeSelectGetCompanyLogoLoading(),
  exportResponse: makeSelectExportCandidateReportPdfResponse(),
  exportError: makeSelectExportCandidateReportPdfError(),
  exportLoading: makeSelectExportCandidateReportPdfLoading(),
  exportJobResponse: makeSelectExportJobActivityReportPdfResponse(),
  exportJobError: makeSelectExportJobActivityReportPdfError(),
  exportJobLoading: makeSelectExportJobActivityReportPdfLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetClientJobDashboardDetail: inviteToken => {
      dispatch(getClientJobDashboardAction(inviteToken));
    },
    onGetCompanyLogo: (agencyId, fileId, type) => {
      dispatch(getCompanyLogo(agencyId, fileId, type));
    },
    onExportCandidatePdf: params => dispatch(clientExportPdfAction(params)),
    clearExportPdf: () => dispatch(clearExportPdfAction()),
    clearJobExportAction: () => dispatch(clearJobExportAction()),
    clientExportJobPdfAction: params => dispatch(clientExportJobPdfAction(params)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ClientJobDashboard);
