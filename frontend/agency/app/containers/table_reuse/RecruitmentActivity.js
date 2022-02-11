import React, { memo, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  makeSelectSaveRecruitmentActivityLoad,
  makeSelectSaveRecruitmentActivityResult,
} from 'containers/common_provider/create_job_state/activity_recruitment_job/selectors';
import {
  saveRecuitmentActivity,
  cleanSaveRecruitment,
} from 'containers/common_provider/create_job_state/activity_recruitment_job/actions';
import SpinnerLoading from 'components/SpinnerLoading';

import { Row, Col } from 'antd';
import { Switch } from 'formik-antd';
import { Formik, FieldArray, useFormikContext } from 'formik';
import { Form } from 'formik-antd';

import FormInfoDetail from 'components/FormInfoDetail';
import ButtonCustom from 'components/atoms/Button';
import InputReadOnlyGroup from 'components/InputReadOnlyGroup';
import CombinedCustom from 'components/CombinedCustom';
import CheckEventForm from './CheckEventForm';
import { openNotification } from 'utils/notification';
import './styles/recruitment.less';

import {
  jobExportPdfAction,
  clearExportPdfAction
} from 'containers/common_provider/export_job_activity_report_pdf/actions';
import {
  makeSelectExportJobActivityReportPdfLoading,
  makeSelectExportJobActivityReportPdfError,
  makeSelectExportJobActivityReportPdfResponse
} from 'containers/common_provider/export_job_activity_report_pdf/selectors';

const initialValues = {
  excludeFromReport: false,
  recuitmentActivity: [
    {
      value: '',
      key: 'Applications received',
    },
    {
      value: '',
      key: 'Targeted approaches',
    },
    {
      value: '',
      key: 'Total candidates considered',
    },
    {
      value: '',
      key: 'Interviews',
    },
    {
      value: '',
      key: 'Shortlisted',
    },
    {
      value: '',
      key: {
        male: 'Male applicants',
        female: 'Female applicants',
      },
    },
    {
      value: '',
      key: 'Candidates withdrawn',
    },
    {
      value: '',
      key: '',
    },
  ],
};

const RecruitmentActivity = props => {
  const {
    recruitmentActivityLoad,
    recruitmentActivityResult,
    saveRecuitmentActivity,
    cleanSaveRecruitment,
    jobExportPdfAction,
    clearExportPdfAction,
    exportResponse,
    exportError,
    exportLoading,
    jobDetail,
  } = props;

  const [excludeActivity, setExcludeActivity] = useState(jobDetail?.exclude_from_report);
  const [toggleInclude, setToggleInclude] = useState(false);

  const handleSubmit = (values, actions) => {
    const payload = {
      exclude_from_report: values.excludeFromReport,
      recruitment_activity: values?.recuitmentActivity.map(
        (activity, index) => {
          return { ...activity, icon: index };
        },
      ),
    };
    saveRecuitmentActivity(jobDetail?.id, payload);
  };

  const onClickExclude = () => {
    if (!excludeActivity) {
      setToggleInclude(true);
    } else {
      setExcludeActivity(false);
      const payload = {
        exclude_from_report: !excludeActivity,
        recruitment_activity: initialValues.recuitmentActivity.map(
          (activity, index) => {
            return { ...activity, icon: index };
          },
        ),
      };
      saveRecuitmentActivity(jobDetail?.id, payload);
    }
  }

  const onExcludeFromReport = () => {
    setExcludeActivity(true);
    const payload = {
      exclude_from_report: true,
      recruitment_activity: initialValues.recuitmentActivity.map(
        (activity, index) => {
          return { ...activity, icon: index };
        },
      ),
    };
    saveRecuitmentActivity(jobDetail?.id, payload);
  }

  const onKeepCurrent = () => {
    setToggleInclude(false);
    setExcludeActivity(false);
  }

  useEffect(() => {
    setExcludeActivity(jobDetail?.exclude_from_report);
    return () => { };
  }, [jobDetail?.exclude_from_report]);

  useEffect(() => {
    if (recruitmentActivityResult?.success) {
      openNotification('success', <FormattedMessage {...messages.recruitmentActivitySuccess} />);
    }
  }, [recruitmentActivityResult]);

  const handleExportToPdf = () => {
    jobExportPdfAction(jobDetail?.id);
  }
  useEffect(() => {
    if (exportResponse) {
      const fileURL = window.URL.createObjectURL(exportResponse?.data);
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', exportResponse?.fileName);
      document.body.appendChild(fileLink);
      fileLink.click();
      clearExportPdfAction();
    }
  }, [exportResponse]);

  useEffect(() => {
    setIsLoading(exportLoading)
  }, [exportLoading]);
   
  useEffect(() => {
    if (exportError) {
      openNotification('error', exportError?.message || 'Export faild.');
      clearExportPdfAction();
    }
  }, [exportError]);

  useEffect(() => { 
    return () =>  cleanSaveRecruitment();
  }, []);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading && <SpinnerLoading loading={isLoading} />}
      <CombinedCustom
        width={600}
        toggleModal={toggleInclude}
        title={<FormattedMessage {...messages.areYouSure} />}
        content={<FormattedMessage {...messages.excludeFromReportContent} />}
        footer={[
          <Row gutter={[8, 8]} justify="center" align="middle">
            <Col>
              <ButtonCustom
                className="btn-primary-gradient"
                onClick={() => {
                  onExcludeFromReport()
                  setToggleInclude(false);
                }}
              >
                {`Exclude`}
              </ButtonCustom>
            </Col>
            <Col>
              <ButtonCustom
                className="btn-secondary"
                onClick={() => onKeepCurrent()}
              >
                {`Okay, keep it`}
              </ButtonCustom>
            </Col>
          </Row>,
        ]}
      />
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, touched, setFieldValue }) => {
          return (
            <Form>
              <FormInfoDetail
                title={<FormattedMessage {...messages.recruitment} />}
                options={
                  <div className={`toggle-exclude`}>
                    <FormattedMessage {...messages.exclude} />
                    <div className={`switch-wrapper`}>
                      <Switch
                        checked={excludeActivity}
                        name="excludeFromReport"
                        onClick={() => onClickExclude()}
                      />
                    </div>
                  </div>
                }
                actions={
                  <Row className="action-group" gutter={[8, 0]}>
                    <Col>
                      <ButtonCustom
                        className="btn-primary-gradient"
                        type="button"
                        onClick={() => handleExportToPdf()}
                      >
                        <FormattedMessage {...messages.download_activity_report} />
                      </ButtonCustom>
                    </Col>
                    <Col>
                      <ButtonCustom
                        type="submit"
                        className="btn-primary-gradient"
                      >
                        <FormattedMessage {...messages.save} />
                      </ButtonCustom>
                    </Col>
                  </Row>
                }
              >
                <Row
                  className={`wrapper-recruitment-activity`}
                  gutter={[{ xs: 8, sm: 16, md: 16, lg: 16 }, 0]}
                >
                  <FieldArray
                    name="recuitmentActivity"
                    render={({ insert, remove, push }) => (
                      <>
                        <Col
                          className={`wrapper-recruitment-left`}
                          xs={24}
                          sm={24}
                          md={24}
                          xl={12}
                          xxl={12}
                        >
                          <Row className={`recruitment-left`} gutter={[0, 0]}>
                            {values.recuitmentActivity?.length > 0 &&
                              values.recuitmentActivity.map(
                                (recruitment, index) => (
                                  <React.Fragment key={index}>
                                    {index <= 3 && (
                                      <Col>
                                        {index !== 7 && index !== 5 && (
                                          <InputReadOnlyGroup
                                            // disabled
                                            icontype={index}
                                            namevalue={`recuitmentActivity[${index}].value`}
                                            namekey={`recuitmentActivity[${index}].key`}
                                            type="text"
                                            remove={setFieldValue}
                                            indexfield={index}
                                            placeholdervalue={`Total`}
                                            placeholdertitle={`Title`}
                                          />
                                        )}
                                        {index === 5 && (
                                          <InputReadOnlyGroup
                                            // disabled
                                            icontype={index}
                                            namevaluefemale={`recuitmentActivity[${index}].value.female`}
                                            namevaluemale={`recuitmentActivity[${index}].value.male`}
                                            namekeymale={`recuitmentActivity[${index}].key.male`}
                                            namekeyfemale={`recuitmentActivity[${index}].key.female`}
                                            indexfield={index}
                                            remove={setFieldValue}
                                            type="text"
                                            case="gender"
                                            placeholdervalue={`Total`}
                                            placeholdertitle={`Title`}
                                            placeholderfemale={`Title Female`}
                                            placeholdermale={`Title Male`}
                                          />
                                        )}
                                        {index === 7 && (
                                          <InputReadOnlyGroup
                                            // disabled
                                            icontype={index}
                                            namevalue={`recuitmentActivity[${index}].value`}
                                            namekey={`recuitmentActivity[${index}].key`}
                                            indexfield={index}
                                            remove={setFieldValue}
                                            case="textarea"
                                            placeholdertextarea={`Reason`}
                                            placeholdervalue={`Total`}
                                          />
                                        )}
                                      </Col>
                                    )}
                                  </React.Fragment>
                                ),
                              )}
                          </Row>
                        </Col>
                        {/* index >= 4 */}
                        <Col
                          className={`wrapper-recruitment-right`}
                          xs={24}
                          sm={24}
                          md={24}
                          xl={12}
                          xxl={12}
                        >
                          <Row className={`recruitment-right`} gutter={[0, 0]}>
                            {values.recuitmentActivity?.length > 0 &&
                              values.recuitmentActivity.map(
                                (recruitment, index) => (
                                  <React.Fragment key={index}>
                                    {index >= 4 && (
                                      <Col>
                                        {index !== 7 && index !== 5 && (
                                          <InputReadOnlyGroup
                                            // disabled
                                            icontype={index}
                                            namevalue={`recuitmentActivity[${index}].value`}
                                            namekey={`recuitmentActivity[${index}].key`}
                                            type="text"
                                            remove={setFieldValue}
                                            indexfield={index}
                                            placeholdervalue={`Total`}
                                            placeholdertitle={`Title`}
                                          />
                                        )}
                                        {index === 5 && (
                                          <InputReadOnlyGroup
                                            // disabled
                                            icontype={index}
                                            namevaluefemale={`recuitmentActivity[${index}].value.female`}
                                            namevaluemale={`recuitmentActivity[${index}].value.male`}
                                            namekeymale={`recuitmentActivity[${index}].key.male`}
                                            namekeyfemale={`recuitmentActivity[${index}].key.female`}
                                            indexfield={index}
                                            remove={setFieldValue}
                                            type="text"
                                            case="gender"
                                            placeholdervalue={`Total`}
                                            placeholdertitle={`Title`}
                                            placeholderfemale={`Title Female`}
                                            placeholdermale={`Title Male`}
                                          />
                                        )}
                                        {index === 7 && (
                                          <InputReadOnlyGroup
                                            // disabled
                                            icontype={index}
                                            namevalue={`recuitmentActivity[${index}].value`}
                                            namekey={`recuitmentActivity[${index}].key`}
                                            indexfield={index}
                                            remove={setFieldValue}
                                            case="textarea"
                                            placeholdertextarea={`Reason`}
                                            placeholdervalue={`Total`}
                                          />
                                        )}
                                      </Col>
                                    )}
                                  </React.Fragment>
                                ),
                              )}
                          </Row>
                        </Col>
                        <Row className={`wrapper-recuitment-btn`}>
                          {values.recuitmentActivity?.length < 8 && (
                            <ButtonCustom
                              onClick={() =>
                                push({
                                  value: '',
                                  key: '',
                                })
                              }
                              case="static"
                              className="btn-primary-gradient recuitment-btn"
                            >
                              {'Add field'}
                            </ButtonCustom>
                          )}
                        </Row>
                      </>
                    )}
                  />
                </Row>
              </FormInfoDetail>
              <CheckEventForm {...props} />
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  recruitmentActivityLoad: makeSelectSaveRecruitmentActivityLoad(),
  recruitmentActivityResult: makeSelectSaveRecruitmentActivityResult(),
  exportResponse: makeSelectExportJobActivityReportPdfResponse(),
  exportError: makeSelectExportJobActivityReportPdfError(),
  exportLoading: makeSelectExportJobActivityReportPdfLoading(),
});

const mapDispatchToProps = {
  saveRecuitmentActivity,
  cleanSaveRecruitment,
  jobExportPdfAction,
  clearExportPdfAction
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(RecruitmentActivity);
