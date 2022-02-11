/**
 *
 * CandidateReportForm
 *
 */

import React, { memo, useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectAssessmentIndustryError,
  makeSelectAssessmentIndustryLoading,
  makeSelectAssessmentIndustrySuccess,
  makeSelectAssessmentTypeError,
  makeSelectAssessmentTypeLoading,
  makeSelectAssessmentTypeSuccess,
  makeSelectProjectAssessmentLoading,
  makeSelectProjectAssessmentSuccess,
  makeSelectInviteAssessmentError,
  makeSelectInviteAssessmentLoading,
  makeSelectInviteAssessmentSuccess,
  makeSelectUploadOriginalSuccess,
  makeSelectUploadOriginalLoading,
  makeSelectUploadOriginalError,
  makeSelectGetOriginalSuccess,
  makeSelectGetOriginalLoading,
  makeSelectResendAssessmentSuccess,
  makeSelectResendAssessmentLoading,
  makeSelectResendAssessmentError,
} from './selectors';

import {
  editCandidateInfoDetail,
  doSaveCandidateReportForm,
  autoSaveCandidateInfoDetail,
} from 'containers/common_provider/candidate_state/edit_candidate_in_list/actions';
import { makeSelectSaveReportForm } from 'containers/common_provider/candidate_state/edit_candidate_in_list/selectors';

import { getCandidateDetail } from 'containers/common_provider/candidate_state/get_candidate_detail/actions';

import {
  getAssessmentIndustryAction,
  getAssessmentTypeAction,
  clearProjectAssessmentAction,
  sendInviteCandidateAssessmentAction,
  clearInvitedAssessmentAction,
  getOriginalAction,
  onUploadOriginalAction,
  clearOriginalAction,
  reSendAssessmentAction,
} from './actions';

import {
  removeDocumentsAction,
  downloadAssessmentReportAction,
  cleanAllStateDocument,
} from '../common_provider/candidate_state/candidate_document/actions';

import {
  makeSelectRemoveDocumentSuccess,
  makeSelectDocumentsError,
  makeSelectDocumentsLoading,
  makeSelectDownloadAssessmentLoading,
  makeSelectDownloadAssessmentError,
  makeSelectDownloadAssessmentSuccess,
} from '../common_provider/candidate_state/candidate_document/selectors';
import reducer from './reducer';
import messages from './messages';
import { Row, Col, Button, Modal, Upload, Tooltip } from 'antd';
import ButtonCustom from 'components/atoms/Button';
import { Form, Input, Checkbox, Select, Switch } from 'formik-antd';
import { Formik, FieldArray } from 'formik';
import {
  PlusOutlined,
  PlusSquareOutlined,
  MinusSquareOutlined,
  PaperClipOutlined,
  SyncOutlined,
  DownloadOutlined,
  FormOutlined,
} from '@ant-design/icons';
import TextBoxCustom from 'components/TextBoxCustom';
import { Collapse } from 'antd';
import ActionType from 'components/TableCustom/ActionType';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor';
import { SelectFormikAntCustom } from 'components/SelectCustom';
import CandidateReportNavigate from 'containers/candidate_report_navigate';
import SpinnerLoading from 'components/SpinnerLoading';
import QuestionCircle from 'images/icons/group-3.svg';
import './styles.less';
import { openNotification } from 'utils/notification';
import CombinedCustom from 'components/CombinedCustom';
import { ContentModal } from '../../components/modals/ContentModal';
import * as Yup from 'yup';
const { Option } = Select;
const { Panel } = Collapse;
const ckConfig = {
  toolbar: {
    items: [
      'heading',
      '|',
      'fontSize',
      'fontFamily',
      'fontColor',
      'fontBackgroundColor',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      'horizontalLine',
      '|',
      'alignment',
      'outdent',
      'indent',
      'pageBreak',
      '|',
      'insertTable',
      'undo',
      'redo',
      'sourceEditing',
    ]
  },
  language: 'en',
 
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],

  },
};
const wheel_options = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(value => ({
  key: value,
  label: value,
  value: value,
}));

const schema = Yup.object().shape({
  candidateEmail: Yup.string()  
    .email('Email is not valid')
    .required('Please enter Email'),
});

const initValues = {
  summaries: [
    {
      title: '',
      description: '',
    },
    {
      title: '',
      description: '',
    },
  ],
  competenceAssessmentWheels: {
    is_apply: false,
    wheels: [
      {
        wheel_name: '',
        competency_list: [
          {
            name: '',
            value: null,
            weight: null,
            is_active: false,
          },
          {
            name: '',
            value: null,
            weight: null,
            is_active: false,
          },
          {
            name: '',
            value: null,
            weight: null,
            is_active: false,
          },
          {
            name: '',
            value: null,
            weight: null,
            is_active: false,
          },
          {
            name: '',
            value: null,
            weight: null,
            is_active: false,
          },
          {
            name: '',
            value: null,
            weight: null,
            is_active: false,
          },
          {
            name: '',
            value: null,
            weight: null,
            is_active: false,
          },
          {
            name: '',
            value: null,
            weight: null,
            is_active: false,
          },
        ],
      },
    ],
  },
  linkedInRecommendation: '',
  candidateAssessmentReports: true,
  candidateEmail: '',
  backgroundCheck: false,
  backgroundCmt: '',
  rightToWork: false,
  rightToWorkCmt: '',
  candidateResume: '',
  additionalInfos: [
    {
      name: 'Portfolio',
      value: '',
    },
    {
      name: 'Personal Website',
      value: '',
    },
    {
      name: 'LinkedIn Profile',
      value: '',
    },
  ],
};

export function CandidateReportForm(props) {
  useInjectReducer({ key: 'candidateReportForm', reducer });

  const {
    history,
    candidateInfo,
    jobType,
    jobId,
    assessmentIndustry,
    assessmentIndustryError,
    assessmentIndustryLoading,
    assessmentType,
    assessmentTypeError,
    assessmentTypeLoading,
    getAssessmentIndustryAction,
    getAssessmentTypeAction,
    clearProjectAssessmentAction,
    assessmentInvited,
    assessmentInvitedLoading,
    downloadAssessmentReportAction,
    assessmentDownload,
    assessmentDownloadLoading,
    assessmentDownloadError,
    clearInvitedAssessmentAction,
    getCandidateDetail,
    onUploadOriginalAction,
    uploadOriginalError,
    uploadOriginalSuccess,
    uploadOriginalLoading,
    original,
    originalLoading,
    getOriginalAction,
    removeDocumentsAction,
    removeOriginal,
    removeLoading,
    removeError,
    cleanAllStateDocument,
    reSendAssessmentAction,
    resend,
    loadingResend,
    errorResend,
    assessmentLimit,
    tabNumber,
    editCandidateInfoDetail,
    autoSaveCandidateInfoDetail,
    saveReportForm,
    doSaveCandidateReportForm,
  } = props;

  const handleGoBack = () => {
    props.handleGoBack();
  };

  const formRef = useRef();
  const inputEmailRef = useRef();
  const [expandIconPosition, setExpandIconPosition] = useState('right');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const [summaryPopup, setSummaryPopup] = useState(false);
  const [recruiterAssessmentPopup, setRecruiterAssessmentPopup] = useState(
    false,
  );

  const [sectionPosition, SetSectionPosition] = useState(null);

  const popupSummaries = remove => {
    return (
      <CombinedCustom
        width={600}
        toggleModal={summaryPopup}
        title={`Are you sure?`}
        content={`Are you sure you want to delete this section?`}
        footer={[
          <Row gutter={[8, 0]}>
            <Col>
              <ButtonCustom
                type="primary"
                className="btn-default-outline btn-77-40"
                onClick={() => {
                  setSummaryPopup(false);
                }}
              >
                {`Cancel`}
              </ButtonCustom>
            </Col>
            <Col>
              <ButtonCustom
                type="primary"
                className="btn-primary-gradient btn-77-40"
                onClick={() => {
                  remove(sectionPosition);
                  // console.log(sectionPosition);
                  setSummaryPopup(false);
                }}
              >
                {`Delete`}
              </ButtonCustom>
            </Col>
          </Row>,
        ]}
      />
    );
  };

  const popupConfirmRemoveRecruiterAssessment = (remove, index) => {
    return (
      <CombinedCustom
        width={600}
        toggleModal={recruiterAssessmentPopup}
        title={`Are you sure?`}
        content={`Are you sure you want to delete this competency?`}
        footer={[
          <Row gutter={[8, 0]}>
            <Col>
              <ButtonCustom
                type="primary"
                className="btn-default-outline btn-77-40"
                onClick={() => {
                  setRecruiterAssessmentPopup(false);
                }}
              >
                {`Cancel`}
              </ButtonCustom>
            </Col>
            <Col>
              <ButtonCustom
                type="primary"
                className="btn-primary-gradient btn-77-40"
                onClick={() => {
                  remove(index);
                  setRecruiterAssessmentPopup(false);
                }}
              >
                {`Delete`}
              </ButtonCustom>
            </Col>
          </Row>,
        ]}
      />
    );
  };

  /** LOGIC SEND ASSESSMENT INVITATION EMAIL */
  const assessmentReports = useMemo(() => {
    return candidateInfo?.assessment_reports || [];
  }, [candidateInfo?.assessment_reports]);

  function formatResume(resume_text) {
    if (resume_text) {
      let finalSencence = '';
      const sentences = resume_text.split(/\r\n|\r|\n|<br>/gi);
      // console.log(`sentences>>`,sentences)
      if (sentences.length == 1 && sentences[0].startsWith('<p>')) {
        sentences[0] = sentences[0].slice(3);
        sentences[0] = sentences[0].substring(0, sentences[0].length - 4);
        return formatResume(sentences[0]);
      }
      for (let i = 0; i < sentences.length; i++) {
        const p = sentences[i];
        if (!p.startsWith('<')) {
          finalSencence += `<p>${p}</p>`;
        } else {
          finalSencence += p;
        }
      }
      return finalSencence.replace(/<p>+<\/p>/gi, '');
    }
    return '';
  }

  const handleChangeRoleType = selectedItems => {
    setSelectedType(selectedItems);
  };

  const handleChangeRoleIndustry = selectedItems => {
    setSelectedIndustry(selectedItems);
  };

  const handleConfirmRemind = assessmentId => {
    Modal.confirm({
      title: false,
      icon: false,
      centered: true,
      className: 'nem-modal-confirm',
      content: (
        <ContentModal
          title={<FormattedMessage {...messages.modalRemindTitle} />}
          message={<FormattedMessage {...messages.modalRemindContent} />}
        />
      ),
      okText: <FormattedMessage {...messages.yes} />,
      cancelText: <FormattedMessage {...messages.cancel} />,
      onOk() {
        reSendAssessmentAction(assessmentId);
      },
    });
  };

  const handleConfirmInvite = record => {
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
      async onOk() {
        localStorage.setItem(
          'dataAssessment',
          JSON.stringify({
            type: selectedType,
            industry: selectedIndustry,
            jobId: jobId,
          }),
        );
        localStorage.setItem(
          `candidateInfo${candidateInfo?.id}`,
          JSON.stringify(candidateInfo),
        );
        await handleSubmit();
        history.push(`/invite_assessment_email/${candidateInfo?.id}`);
      },
    });
  };

  const handleSummitData = values => {
    return {
      additional_infos: values?.additionalInfos,
      include_assessment_report: values?.candidateAssessmentReports,
      resume_text: values?.candidateResume,
      linked_in_recommend: values?.linkedInRecommendation,
      summaries: values?.summaries,
      background_check: values?.backgroundCheck,
      background_comment: values?.backgroundCmt,
      right_to_work: values?.rightToWork,
      right_to_work_comment: values?.rightToWorkCmt,
      recruiter_assessments: values?.competenceAssessmentWheels,
      candidate_email: values?.candidateEmail,
    };
  };

  const handleSubmit = async () => {
    await formRef.current?.handleSubmit();
  };

  const onFinish = async values => {
    if (!values) return;
    const payload = handleSummitData(values);
    await editCandidateInfoDetail(candidateInfo?.id, jobId, payload);
  };

  const handleDownloadAssement = assessmentId => {
    if (!candidateInfo?.id) return;
    downloadAssessmentReportAction(assessmentId);
  };

  const autoSaveReportForm = values => {
    if (!values) return;
    const payload = handleSummitData(values);
    autoSaveCandidateInfoDetail(candidateInfo?.id, jobId, payload);
  };

  useEffect(() => {
    if (assessmentDownload) {
      const fileURL = window.URL.createObjectURL(assessmentDownload?.data);
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', assessmentDownload?.fileName);
      document.body.appendChild(fileLink);
      fileLink.click();
    }
  }, [assessmentDownload]);

  useEffect(() => {
    if (saveReportForm?.state) {
      const save = async () => {
        await handleSubmit();
        doSaveCandidateReportForm({ state: false, isGoBack: false });
      };
      if (
        formRef.current?.errors &&
        Object.keys(formRef.current?.errors).length
      ) {
        inputEmailRef?.current.focus();
        return;
      }
      save();
      if (saveReportForm?.isGoBack) {
        history.push(saveReportForm?.url);
      }
    }
  }, [saveReportForm]);

  useEffect(() => {
    getAssessmentIndustryAction();
    getAssessmentTypeAction();
    clearProjectAssessmentAction();
    clearInvitedAssessmentAction();
    return () => {
      setSelectedIndustry('');
      setSelectedType('');
      cleanAllStateDocument();
      clearOriginalAction();
    };
  }, []);

  useEffect(() => {
    if (assessmentInvited) {
      openNotification('success', 'Assessment invite successfully!');
      onCancel();
      clearProjectAssessmentAction();
      clearInvitedAssessmentAction();
      getCandidateDetail(candidateInfo?.id, {
        params: {
          job_id: jobId,
        },
      });
    }
  }, [assessmentInvited]);

  useEffect(() => {
    if (resend) {
      openNotification('success', 'Remind successfully!');
    }
  }, [resend]);

  useEffect(() => {
    if (errorResend) {
      openNotification('error', errorResend);
    }
  }, [errorResend]);

  useEffect(() => {
    const isLoading =
      assessmentIndustryLoading ||
      assessmentTypeLoading ||
      assessmentInvitedLoading ||
      uploadOriginalLoading ||
      originalLoading ||
      removeLoading;
    setIsLoading(isLoading);
  }, [
    assessmentIndustryLoading,
    assessmentTypeLoading,
    assessmentInvitedLoading,
    uploadOriginalLoading,
    originalLoading,
  ]);

  useEffect(() => {
    const error =
      assessmentIndustryError || assessmentTypeError || assessmentDownloadError;
    if (error) {
      openNotification('error', error?.message || 'Error!');
    }
  }, [assessmentIndustryError, assessmentTypeError]);
  /** END */

  const handleUploadResumeFile = file => {
    if (!candidateInfo?.id) return;
    const formData = new FormData();
    formData.append('original', file, file.name);
    onUploadOriginalAction(candidateInfo?.id, formData);
  };

  const handleDeleteOriginal = (e, original) => {
    e.stopPropagation();
    if (!candidateInfo?.id || !original) return;
    Modal.confirm({
      title: false,
      icon: false,
      centered: true,
      className: 'nem-modal-confirm',
      content: (
        <ContentModal
          title={<FormattedMessage {...messages.confirmRemoveTitle} />}
          message={<FormattedMessage {...messages.confirmRemoveMessage} />}
        />
      ),
      okText: <FormattedMessage {...messages.buttonRemove} />,
      async onOk() {
        await removeDocumentsAction(candidateInfo?.id, original?.id);
      },
    });
  };

  useEffect(() => {
    getOriginalAction(candidateInfo?.id);
  }, [candidateInfo]);

  useEffect(() => {
    if (uploadOriginalSuccess) {
      openNotification('success', 'Upload original resume success.');
      clearOriginalAction();
      getOriginalAction(candidateInfo?.id);
    }
  }, [uploadOriginalSuccess]);

  useEffect(() => {
    if (removeOriginal) {
      openNotification('success', 'Remove original resume success.');
      cleanAllStateDocument();
      getOriginalAction(candidateInfo?.id);
    }
  }, [removeOriginal]);

  useEffect(() => {
    if (uploadOriginalError)
      openNotification('error', 'Upload original resume faild.');
    if (removeError) openNotification('error', 'Remove original resume faild.');
  }, [uploadOriginalError, removeError]);

  if (isLoading) return <SpinnerLoading loading={isLoading} />;

  return (
    <>
      <Formik
        initialValues={initValues}
        validationSchema={schema}
        onSubmit={onFinish}
        innerRef={formRef}
      >
        {({ values, errors, touched, setFieldValue }) => {
          return (
            <Form
              autoComplete="off"
              onBlur={() => {
                autoSaveReportForm(values);
              }}
            >
              <Collapse
                bordered={false}
                defaultActiveKey={['1', '2', '3', '4', '5', '6', '7', '8']}
                expandIcon={({ isActive }) => {
                  return !isActive ? (
                    <Row>
                      <PlusSquareOutlined />
                      {` Expand`}
                    </Row>
                  ) : (
                    <Row>
                      <MinusSquareOutlined />
                      {` Collapse`}
                    </Row>
                  );
                }}
                expandIconPosition={expandIconPosition}
                className="site-collapse-custom-collapse"
              >
                <Panel
                  header={
                    <h1 className={`style__candidate`}>
                      {<FormattedMessage {...messages.candidateSummary} />}
                    </h1>
                  }
                  key="1"
                  className="site-collapse-custom-panel"
                >
                  <FieldArray name="summaries">
                    {({ remove, push }) => (
                      <>
                        <div className="wrapper-summaries">
                          {values?.summaries?.map((summary, index) => (
                            <div className={`summaries`} key={index}>
                              <TextBoxCustom
                                titleField={[
                                  <Row
                                    justify="space-between"
                                    align="center"
                                    gutter={[8, 8]}
                                  >
                                    <Col md={16}>
                                      <Input
                                        fast={true}
                                        className={`ant-custom-input`}
                                        name={`summaries[${index}].title`}
                                        placeholder="Input title ..."
                                      />
                                    </Col>
                                    <Col md={4}>
                                      <div className={`flex-custom flex-end`}>
                                        {popupSummaries(remove)}
                                        <ActionType
                                          onClick={() => {
                                            setSummaryPopup(true);
                                            SetSectionPosition(index);
                                          }}
                                          type="delete"
                                        />
                                      </div>
                                    </Col>
                                  </Row>,
                                ]}
                                contentField={[
                                  <Form.Item
                                    name={`summaries[${index}].description`}
                                  // hasFeedback={true}
                                  // showValidateSuccess={true}
                                  >
                                    <Input.TextArea
                                      fast={true}
                                      autoSize={{
                                        minRows: 5,
                                        maxRows: 8,
                                      }}
                                      className={`ant-custom-textarea`}
                                      name={`summaries[${index}].description`}
                                    // placeholder="Summary content"
                                    />
                                  </Form.Item>,
                                ]}
                              />
                            </div>
                          ))}
                        </div>
                        <Row justify="center">
                          <ButtonCustom
                            case="static"
                            className={`btn-primary-gradient`}
                            onClick={() => push({ title: '', description: '' })}
                          >
                            <PlusOutlined className={`btn-icon`} />
                            {`Add section`}
                          </ButtonCustom>
                        </Row>
                      </>
                    )}
                  </FieldArray>
                </Panel>
                <Panel
                  header={
                    <>
                      <h1 className={`style__candidate`}>
                        {<FormattedMessage {...messages.recruiterAssessment} />}
                      </h1>
                      <h5>
                        A minimum of 3 competencies are required, otherwise the
                        graph will not display correctly
                      </h5>
                    </>
                  }
                  key="2"
                  className="site-collapse-custom-panel"
                >
                  <Row gutter={[8, 8]}>
                    <Col>
                      <Checkbox
                        id="competenceAssessmentWheels"
                        name={`competenceAssessmentWheels.is_apply`}
                      />
                    </Col>
                    <Col>
                      <label
                        htmlFor="competenceAssessmentWheels"
                        className={`ml-13`}
                      >
                        {<FormattedMessage {...messages.applyCompetencies} />}
                      </label>
                    </Col>
                  </Row>
                  <FieldArray name={`competenceAssessmentWheels.wheels`}>
                    {({ remove, push }) => (
                      <>
                        <Row className="wrapper-assessment" gutter={[32, 16]}>
                          {values?.competenceAssessmentWheels?.wheels?.map(
                            (summary, wheelIndex) => (
                              <Col
                                className={`assessment-block`}
                                key={wheelIndex}
                                md={12}
                                xs={24}
                              >
                                <Row className={`competency-${wheelIndex + 1}`}>
                                  <Col span={19}>
                                    <h3>{`Competency Wheel ${wheelIndex +
                                      1}`}</h3>
                                  </Col>
                                  <Col span={5} style={{ textAlign: 'center' }}>
                                    <div style={{ justifyContent: 'center' }}>
                                      {popupConfirmRemoveRecruiterAssessment(
                                        remove,
                                        wheelIndex,
                                      )}
                                      <ActionType
                                        style={{ justifyContent: 'center' }}
                                        onClick={() => {
                                          setRecruiterAssessmentPopup(true);
                                        }}
                                        type="delete"
                                      />
                                    </div>
                                  </Col>
                                </Row>

                                <Row align="middle" gutter={[8, 8]}>
                                  <Col span={24}>
                                    <Input
                                      fast={true}
                                      className={`ant-custom-input`}
                                      name={`competenceAssessmentWheels.wheels[${wheelIndex}].wheel_name`}
                                      placeholder="Summary title"
                                    />
                                  </Col>
                                  {/*<Col span={5} style={{ textAlign: 'center' }}>*/}
                                  {/*  <div>Weighting</div>*/}
                                  {/*</Col>*/}
                                </Row>
                                {/* ===================== assessments ============ */}
                                <FieldArray
                                  name={`competenceAssessmentWheels.wheels[${wheelIndex}].competency_list`}
                                >
                                  {arrayHelpers => (
                                    <Row
                                      className={`assessments`}
                                      gutter={[8, 8]}
                                    >
                                      {summary?.competency_list?.map(
                                        (assessment, index) => (
                                          // <>
                                          <Col span={24} key={index}>
                                            <Row gutter={[8, 8]} align="middle">
                                              <Col span={2}>
                                                <Checkbox
                                                  fast={true}
                                                  name={`competenceAssessmentWheels.wheels[${wheelIndex}].competency_list[${index}].is_active`}
                                                />
                                              </Col>
                                              <Col span={17}>
                                                <Input
                                                  fast={true}
                                                  className={`ant-custom-input`}
                                                  name={`competenceAssessmentWheels.wheels[${wheelIndex}].competency_list[${index}].name`}
                                                />
                                              </Col>
                                              <Col span={5}>
                                                <SelectFormikAntCustom
                                                  fast={true}
                                                  options={wheel_options}
                                                  // className={`ant-custom-select`}
                                                  name={`competenceAssessmentWheels.wheels[${wheelIndex}].competency_list[${index}].value`}
                                                />
                                              </Col>
                                              {/*<Col span={5}>*/}
                                              {/*  <Input*/}
                                              {/*    fast={true}*/}
                                              {/*    className={`ant-custom-input`}*/}
                                              {/*    name={`competenceAssessmentWheels.wheels[${wheelIndex}].competency_list[${index}].weight`}*/}
                                              {/*  />*/}
                                              {/*</Col>*/}
                                            </Row>
                                          </Col>
                                          // </>
                                        ),
                                      )}
                                    </Row>
                                  )}
                                </FieldArray>
                              </Col>
                            ),
                          )}
                          <Col
                            className={`wrapper-btn-another-competency`}
                            md={12}
                            xs={24}
                          >
                            {values?.competenceAssessmentWheels?.wheels &&
                              values?.competenceAssessmentWheels?.wheels
                                .length <= 1 && (
                                <ButtonCustom
                                  case="static"
                                  className={`btn-primary-gradient`}
                                  onClick={() =>
                                    push({
                                      wheel_name: '',
                                      competency_list: [
                                        {
                                          name: '',
                                          value: null,
                                          weight: null,
                                          is_active: false,
                                        },
                                        {
                                          name: '',
                                          value: null,
                                          weight: null,
                                          is_active: false,
                                        },
                                        {
                                          name: '',
                                          value: null,
                                          weight: null,
                                          is_active: false,
                                        },
                                        {
                                          name: '',
                                          value: null,
                                          weight: null,
                                          is_active: false,
                                        },
                                        {
                                          name: '',
                                          value: null,
                                          weight: null,
                                          is_active: false,
                                        },
                                        {
                                          name: '',
                                          value: null,
                                          weight: null,
                                          is_active: false,
                                        },
                                        {
                                          name: '',
                                          value: null,
                                          weight: null,
                                          is_active: false,
                                        },
                                        {
                                          name: '',
                                          value: null,
                                          weight: null,
                                          is_active: false,
                                        },
                                      ],
                                    })
                                  }
                                >
                                  <PlusOutlined className={`btn-icon`} />
                                  {`Another competency wheel`}
                                </ButtonCustom>
                              )}
                          </Col>
                        </Row>
                      </>
                    )}
                  </FieldArray>
                </Panel>
                {assessmentLimit && assessmentLimit > 0 && (
                  <Panel
                    header={
                      <h1 className={`style__candidate`}>
                        {<FormattedMessage {...messages.candidateAandR} />}
                      </h1>
                    }
                    key="3"
                    className="site-collapse-custom-panel"
                  >
                    <Row
                      align="middle"
                      gutter={[8, 8]}
                      style={{ marginBottom: '20px', marginLeft: '5px' }}
                    >
                      <h4>
                        Invite your candidate to complete the Express
                        Personality Profile Assessment. View sample report
                        <a
                          target="_blank"
                          href={`https://www.testpartnership.com/samplereports/sample-report-personality-summary.pdf`}
                          style={{ marginLeft: '5px', color: '#3abcca' }}
                        >
                          here
                        </a>
                      </h4>
                    </Row>
                    <Row
                      className={`wrapper-select-type`}
                      align="middle"
                      gutter={[8, 8]}
                    >
                      <Col
                        xxl={6}
                        xl={8}
                        lg={10}
                        md={12}
                        xs={24}
                        className="wrapper-select-type-item"
                      >
                        <Select
                          style={{ width: '100%' }}
                          label={`Industry`}
                          name="industry"
                          showSearch={true}
                          placeholder={'Select Role Industry'}
                          defaultValue={
                            assessmentReports && assessmentReports.length
                              ? assessmentReports[0].industry
                                ? assessmentReports[0].industry.id
                                : undefined
                              : undefined
                          }
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={handleChangeRoleIndustry}
                        >
                          {assessmentIndustry &&
                            assessmentIndustry.map(industry => {
                              return (
                                <Option key={industry.id} value={industry.id}>
                                  {industry.name}
                                </Option>
                              );
                            })}
                        </Select>
                      </Col>
                      <Col
                        xxl={6}
                        xl={8}
                        lg={10}
                        md={12}
                        xs={24}
                        className="wrapper-select-type-item"
                      >
                        <Select
                          style={{ width: '100%' }}
                          label={`Role Type`}
                          name="roleType"
                          showSearch={true}
                          defaultValue={
                            assessmentReports && assessmentReports.length
                              ? assessmentReports[0].type
                                ? assessmentReports[0].type.id
                                : undefined
                              : undefined
                          }
                          placeholder={'Select Role Type'}
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={handleChangeRoleType}
                        >
                          {assessmentType &&
                            assessmentType.map(type => {
                              return (
                                <Option key={type.id} value={type.id}>
                                  {type.name}
                                </Option>
                              );
                            })}
                        </Select>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        {!assessmentReports || !assessmentReports.length ? (
                          <Row className="assessment-report-item">
                            <Col className="item-placeholder">
                              <span>
                                {
                                  <FormattedMessage
                                    {...messages.profileAssessment}
                                  />
                                }
                              </span>
                              <img
                                src={QuestionCircle}
                                style={{ marginLeft: '10px' }}
                              />
                            </Col>
                            <Col
                              className="item-info"
                              style={{ marginLeft: '10px' }}
                            >
                              <Tooltip
                                placement="top"
                                title={
                                  !selectedIndustry || !selectedType
                                    ? `Please select role industry and role type before invite assessment! `
                                    : ``
                                }
                              >
                                <Button
                                  type="primary"
                                  disabled={!selectedIndustry || !selectedType}
                                  className="invite-button"
                                  onClick={() => handleConfirmInvite(values)}
                                >
                                  Invite
                                </Button>
                              </Tooltip>
                            </Col>
                          </Row>
                        ) : null}
                        {assessmentReports.length > 0 &&
                          assessmentReports.map(rp => {
                            return (
                              <Row
                                className="assessment-report-item"
                                key={rp?.id}
                              >
                                <Col className="item-placeholder">
                                  <span>
                                    TPAQ-27 Express Personality Profile
                                  </span>
                                  <img
                                    src={QuestionCircle}
                                    style={{
                                      marginLeft: '10px',
                                    }}
                                  />
                                </Col>
                                <Col className="item-info">
                                  <Row style={{ alignItems: 'center' }}>
                                    <Col className="item-info__box">
                                      <Button
                                        type="default"
                                        className="invite-button"
                                      >
                                        Invited
                                      </Button>
                                    </Col>
                                    <Col className="item-info__box">
                                      <span
                                        className={`status ${rp?.status &&
                                          ['Submitted', 'Downloaded'].includes(
                                            rp?.status,
                                          )
                                          ? `success`
                                          : `danger`
                                          }`}
                                      >
                                        {rp?.status}
                                      </span>
                                    </Col>
                                    <Col className="item-info__box">
                                      {rp?.status &&
                                        !['Submitted', 'Downloaded'].includes(
                                          rp?.status,
                                        ) && (
                                          <span
                                            className="remind"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() =>
                                              handleConfirmRemind(
                                                rp?.assessment_id,
                                              )
                                            }
                                          >
                                            {loadingResend ? (
                                              <SyncOutlined
                                                spin
                                                style={{
                                                  fontSize: '16px',
                                                  marginRight: '5px',
                                                }}
                                              />
                                            ) : (
                                              <SyncOutlined
                                                style={{
                                                  fontSize: '16px',
                                                  marginRight: '5px',
                                                }}
                                              />
                                            )}
                                            <span>Remind</span>
                                          </span>
                                        )}
                                      {rp?.status &&
                                        ['Submitted', 'Downloaded'].includes(
                                          rp?.status,
                                        ) && (
                                          <span
                                            className="remind"
                                            style={{ cursor: 'pointer' }}
                                            onClick={e => {
                                              e.preventDefault();
                                              handleDownloadAssement(
                                                rp?.assessment_id,
                                              );
                                            }}
                                          >
                                            {assessmentDownloadLoading ? (
                                              <SyncOutlined
                                                spin
                                                style={{
                                                  fontSize: '16px',
                                                  marginRight: '5px',
                                                }}
                                              />
                                            ) : (
                                              <DownloadOutlined
                                                style={{
                                                  fontSize: '16px',
                                                  marginRight: '5px',
                                                }}
                                              />
                                            )}
                                            Download assessment results
                                          </span>
                                        )}
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            );
                          })}
                      </Col>
                    </Row>
                    <Row
                      className={`wrapper-switch-include`}
                      align="middle"
                      gutter={[8, 8]}
                    >
                      <Col className={'wrapper-info-assessment'}>
                        <label htmlFor={`candidateAssessmentReports`}>
                          {`Include candidate assessment results in client dashboard`}
                        </label>
                        <div className={`switch-wrapper`}>
                          <Switch
                            id="candidateAssessmentReports"
                            name="candidateAssessmentReports"
                            fast={true}
                          />
                        </div>
                      </Col>
                      <Col className={'wrapper-info-assessment'}>
                        <div className="candidate-email">
                          <div className={'candidate-email__icon'}>
                            <FormOutlined onClick={() => {
                              if (inputEmailRef.current) inputEmailRef.current.focus();
                            }} />
                          </div>
                          <div className={`form-ant-group`}>
                            <label className="form-ant-label">
                              Assessment invite will be sent to:
                            </label>
                            <Input
                              label={`Assessment invite will be sent to:`}
                              className="label-candidate-email"
                              name="candidateEmail"
                              ref={inputEmailRef}
                            />
                          </div>
                        </div>
                        {errors.candidateEmail && touched.candidateEmail ? (
                          <div className="email-error">
                            {errors.candidateEmail}
                          </div>
                        ) : null}
                      </Col>
                    </Row>
                  </Panel>
                )}
                <Panel
                  header={
                    <h1 className={`style__candidate`}>
                      {<FormattedMessage {...messages.BackgroundCheck} />}
                    </h1>
                  }
                  key="4"
                  className="site-collapse-custom-panel"
                >
                  <Row
                    className={`wrapper-switch-include`}
                    align="middle"
                    gutter={[8, 8]}
                  >
                    <Col>
                      <Checkbox
                        id={`backgroundCheck`}
                        fast={true}
                        name={`backgroundCheck`}
                      />
                    </Col>
                    <Col>
                      <label htmlFor={`backgroundCheck`} id={`backgroundCheck`}>
                        {`Internet & Social Media Background Check Completed`}
                      </label>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <label
                        htmlFor={`backgroundCmt`}
                        className={`textbox-title`}
                      >
                        {`Add comments only if relevant`}
                      </label>
                    </Col>
                    <Col span={24}>
                      <Input.TextArea
                        id={`backgroundCmt`}
                        fast={true}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        className={`ant-custom-textarea`}
                        name={`backgroundCmt`}
                      />
                    </Col>
                  </Row>
                </Panel>
                <Panel
                  header={
                    <h1 className={`style__candidate`}>
                      {<FormattedMessage {...messages.rightToWork} />}
                    </h1>
                  }
                  key="5"
                  className="site-collapse-custom-panel"
                >
                  <Row
                    className={`wrapper-switch-include`}
                    align="middle"
                    gutter={[8, 8]}
                  >
                    <Col>
                      <Checkbox
                        id={`rightToWork`}
                        fast={true}
                        name={`rightToWork`}
                      />
                    </Col>
                    <Col>
                      <label htmlFor={`rightToWork`}>
                        {`Candidate has the right to work`}
                      </label>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <label
                        htmlFor={`rightToWorkCmt`}
                        className={`textbox-title`}
                      >
                        {`Add comments only if relevant`}
                      </label>
                    </Col>
                    <Col span={24}>
                      <Input.TextArea
                        id={`rightToWorkCmt`}
                        fast={true}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        className={`ant-custom-textarea`}
                        name={`rightToWorkCmt`}
                      />
                    </Col>
                  </Row>
                </Panel>
                <Panel
                  header={
                    <h1 className={`style__candidate`}>
                      {<FormattedMessage {...messages.linkedlnRecommend} />}
                    </h1>
                  }
                  key="6"
                  className="site-collapse-custom-panel"
                >
                  <CKEditor
                    key={`resume_linked`}
                    editor={ClassicEditor}
                    config={ckConfig}
                    // disabled={true}
                    data={
                      candidateInfo?.linked_in_recommend
                        ? candidateInfo?.linked_in_recommend
                        : '' || {}
                    }
                    onReady={editor => {
                      editor?.editing?.view?.change(writer => {
                        const viewEditableRoot = editor.editing.view.document.getRoot();

                        writer.setAttribute(
                          'spellcheck',
                          'true',
                          viewEditableRoot,
                        );
                      });
                      if (editor) {
                        const data = editor.getData();
                        setFieldValue('linkedInRecommendation', data);
                      }
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setFieldValue('linkedInRecommendation', data);
                    }}
                    onBlur={(event, editor) => { }}
                    onFocus={(event, editor) => { }}
                  />
                </Panel>
                <Panel
                  header={[
                    <Row
                      gutter={[{ xs: 8, sm: 16, md: 32, xxl: 32 }, 8]}
                      key={`wrapper_candidateResume`}
                    >
                      <Col>
                        <h1 className={`style__candidate`}>
                          {<FormattedMessage {...messages.candidateResume} />}
                        </h1>
                      </Col>
                      <Col>
                        <Upload
                          multiple={false}
                          showUploadList={true}
                          customRequest={({ file, onSuccess }) => {
                            setTimeout(() => {
                              onSuccess('ok');
                            }, 0);
                          }}
                          beforeUpload={file => handleUploadResumeFile(file)}
                        >
                          <ButtonCustom
                            case="static"
                            className={`btn-default-outline`}
                          >
                            <PaperClipOutlined className={`btn-icon`} />
                            {`Attach Original Resume`}
                          </ButtonCustom>
                        </Upload>
                      </Col>
                      {original && (
                        <Col className="col-original">
                          <div className={'original-file'}>
                            <PaperClipOutlined />
                            <p className={'file-name'}>{original?.file_name}</p>
                            <i
                              className="action-icon far fa-trash-alt"
                              style={{ color: '#f54e60', fontSize: '16px' }}
                              onClick={e => handleDeleteOriginal(e, original)}
                            />
                          </div>
                        </Col>
                      )}
                    </Row>,
                  ]}
                  key="7"
                  className="site-collapse-custom-panel"
                >
                  <CKEditor
                    key={`resume_text`}
                    editor={ClassicEditor}
                    config={ckConfig}
                    data={
                      candidateInfo?.resume_text
                        ? formatResume(
                          candidateInfo?.revision_number === 1 ?
                            candidateInfo?.resume_text.replace(/<p>(&nbsp;)+<\/p>/gi, '') :
                            candidateInfo?.resume_text.replace(
                              /\n/g,
                              '<br />'))
                        : '' || {}
                    }
                    onReady={editor => {
                      // console.log(`editor>>`,editor)
                      // You can store the "editor" and use when it is needed.
                      // console.log('Editor is ready to use!', editor);
                      editor?.editing?.view?.change(writer => {
                        const viewEditableRoot = editor.editing.view.document.getRoot();

                        writer.setAttribute(
                          'spellcheck',
                          'true',
                          viewEditableRoot,
                        );
                      });
                      if (editor) {
                        const data = editor.getData();
                        setFieldValue('candidateResume', data);
                      }
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setFieldValue('candidateResume', data);
                    }}
                    onBlur={(event, editor) => {
                      // console.log('Blur.', editor);
                    }}
                    onFocus={(event, editor) => {
                      // console.log('Focus.', editor);
                    }}
                  />
                </Panel>

                <Panel
                  header={
                    <h1 className={`style__candidate`}>
                      {
                        <FormattedMessage
                          {...messages.additionalCandidateInformation}
                        />
                      }
                    </h1>
                  }
                  key="8"
                  className="site-collapse-custom-panel"
                >
                  <div>
                    <FieldArray name="additionalInfos">
                      {({ remove, push }) => (
                        <>
                          <Row
                            className="wrapper-additionalInfos"
                            gutter={[32, 32]}
                          >
                            {values?.additionalInfos?.map((summary, index) => (
                              <Col
                                xxl={12}
                                xl={12}
                                sm={12}
                                xs={24}
                                className={`additionalInfos`}
                                key={index}
                              >
                                <Row className={`wrapper-group-input`}>
                                  <Col span={24}>
                                    <Input
                                      fast={true}
                                      className={`ant-custom-input info-title`}
                                      name={`additionalInfos[${index}].name`}
                                      placeholder={`Input title ...`}
                                    />
                                  </Col>
                                  <Col span={24}>
                                    <Input
                                      fast={true}
                                      className={`ant-custom-input`}
                                      name={`additionalInfos[${index}].value`}
                                    />
                                  </Col>
                                </Row>
                              </Col>
                            ))}
                          </Row>
                          <Row justify="center">
                            <ButtonCustom
                              case="static"
                              className={`btn-primary-gradient`}
                              onClick={() => push({ name: '', value: '' })}
                            >
                              <PlusOutlined className={`btn-icon`} />
                              {`Add New Field`}
                            </ButtonCustom>
                          </Row>
                        </>
                      )}
                    </FieldArray>
                  </div>
                </Panel>
              </Collapse>
              <CandidateReportNavigate
                history={history}
                candidateInfo={candidateInfo}
                jobId={jobId}
                jobType={jobType}
                tabNumber={tabNumber}
                handleGoBack={() => handleGoBack()}
              />
            </Form>
          );
        }}
      </Formik>
    </>
  );
}

CandidateReportForm.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  assessmentIndustry: makeSelectAssessmentIndustrySuccess(),
  assessmentIndustryError: makeSelectAssessmentIndustryError(),
  assessmentIndustryLoading: makeSelectAssessmentIndustryLoading(),
  assessmentType: makeSelectAssessmentTypeSuccess(),
  assessmentTypeError: makeSelectAssessmentTypeError(),
  assessmentTypeLoading: makeSelectAssessmentTypeLoading(),
  assessmentProject: makeSelectProjectAssessmentSuccess(),
  assessmentProjectLoading: makeSelectProjectAssessmentLoading(),
  assessmentInvited: makeSelectInviteAssessmentSuccess(),
  assessmentInvitedLoading: makeSelectInviteAssessmentLoading(),
  assessmentInvitedError: makeSelectInviteAssessmentError(),
  uploadOriginalSuccess: makeSelectUploadOriginalSuccess(),
  uploadOriginalError: makeSelectUploadOriginalError(),
  uploadOriginalLoading: makeSelectUploadOriginalLoading(),
  original: makeSelectGetOriginalSuccess(),
  originalLoading: makeSelectGetOriginalLoading(),
  removeOriginal: makeSelectRemoveDocumentSuccess(),
  removeError: makeSelectDocumentsError(),
  removeLoading: makeSelectDocumentsLoading(),
  resend: makeSelectResendAssessmentSuccess(),
  loadingResend: makeSelectResendAssessmentLoading(),
  errorResend: makeSelectResendAssessmentError(),
  assessmentDownload: makeSelectDownloadAssessmentSuccess(),
  assessmentDownloadLoading: makeSelectDownloadAssessmentLoading(),
  assessmentDownloadError: makeSelectDownloadAssessmentError(),
  saveReportForm: makeSelectSaveReportForm(),
});

const mapDispatchToProps = {
  getAssessmentIndustryAction,
  getAssessmentTypeAction,
  clearProjectAssessmentAction,
  sendInviteCandidateAssessmentAction,
  clearInvitedAssessmentAction,
  getCandidateDetail,
  getOriginalAction,
  onUploadOriginalAction,
  removeDocumentsAction,
  cleanAllStateDocument,
  clearOriginalAction,
  reSendAssessmentAction,
  downloadAssessmentReportAction,
  editCandidateInfoDetail,
  doSaveCandidateReportForm,
  autoSaveCandidateInfoDetail,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CandidateReportForm);
