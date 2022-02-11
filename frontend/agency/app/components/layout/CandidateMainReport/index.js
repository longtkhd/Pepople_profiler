import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Typography, Card, Checkbox, Button } from 'antd';

import {
  FilePdfOutlined,
  StarOutlined,
  MessageOutlined,
  DownloadOutlined,
} from '@ant-design/icons';

import Container from 'components/Container';
import ContainerBorder from 'components/ContainerBorder';
import RadarChart from 'components/RadarChart';
import StarRate from 'components/StarRate';
import Statistics from 'components/layout/CandidateReportLayout/statistics';
import ProgessGroup from 'components/ProgessGroup';
import messages from './messages';
import { FormattedMessage } from 'react-intl';
import RawHtml from 'components/RawHtml';
const { Title } = Typography;

import './styles.less';
import ClientFeedbackForm from 'components/ClientFeedbackForm';

function CandidateMainReport(props) {
  const {
    candidateInfo,
    jobType,
    classNames,
    onFeedback,
    feedback,
    contactInfo,
    disableSubmit,
    onDownload,
    onDownloadAssessment,
    onExport,
    clientReview,
    onInterview,
    interviewStatus
  } = props;

  const buttonStyle = {
    backgroundColor: classNames?.buttonColor,
    backgroundImage:
      classNames?.buttonColor || `linear-gradient(to left, #5c96d4, #24bbce)`,
  };

  const linkstyle = {
    color: classNames?.linkColor,
  };

  let regexUrl = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

  const handleDowloadDocument = doc => {
    if (!onDownload) return;
    onDownload(doc);
  };

  const handleDowloadAssessment = (e, assessmentId) => {
    e.preventDefault();
    if (!assessmentId) return;
    onDownloadAssessment(assessmentId);
  };

  const handleExportToPdf = candidateId => {
    if (!candidateId) return;
    const params = { candidate_id: [candidateId] };
    onExport(params);
  };

  const handleFeedback = values => {
    if (!onFeedback) return;
    if (!candidateInfo?.id) return;
    const data = {
      ...values,
      candidate_id: candidateInfo?.id,
    };
    onFeedback(data);
  };

  const reversePersonalReport = reports => {
    if (!reports) return [];
    const radarData = reports.map(r => { return { ...r, name: r["Group"], value: r["RoundedStenScore"] } })
    let newArray = [radarData[0]].concat(radarData.slice(1).reverse());
    return newArray;
  };

  const getRadarCompetencys = competencys => {
    if (!competencys) return [];
    return competencys.filter(c => c?.is_active);
  };
  const isDisplay = competencys => {
    if (!competencys) false;
    return competencys.filter(c => c?.is_active).length > 0;
  };

  const statistic = useMemo(() => {
    if (!candidateInfo) return null;
    let statistic = {
      jobType: jobType,
      current_position: candidateInfo?.current_position,
      current_employer: candidateInfo?.current_employer,
      exp_rem: candidateInfo?.exp_rem,
      notice_period: candidateInfo?.notice_period,
      candidate_name: candidateInfo?.candidate_name,
      contactName: contactInfo?.first_name,
    };
    return statistic;
  }, [
    candidateInfo?.current_position,
    candidateInfo?.current_employer,
    candidateInfo?.exp_rem,
    candidateInfo?.notice_period,
    candidateInfo?.candidate_name,
    contactInfo?.first_name,
  ]);

  const assessmentReports = useMemo(() => {
    return candidateInfo?.assessment_reports || [];
  }, [candidateInfo?.assessment_reports]);

  const showAdditionalInfos = useMemo(() => {
    const infos = candidateInfo?.additional_infos || [];
    return infos.some(info => {
      return info?.name && info?.value;
    });
  }, [candidateInfo?.additional_infos]);

  return (
    <div>
      {candidateInfo && (
        <>
          <ContainerBorder>
            <Container>
              <Row
                justify="space-between"
                align="center"
                style={{ padding: '50px 0' }}
              >
                <Statistics
                  statistics={statistic}
                  clientReview={clientReview}
                />
                <Col lg={8} md={24} sm={24} xs={24}>
                  <div className="rate">
                    <Button
                      icon={<FilePdfOutlined />}
                      className={'bgApi-w'}
                      style={{ ...buttonStyle }}
                      onClick={() => handleExportToPdf(candidateInfo?.id)}
                    >
                      <FormattedMessage {...messages.exportPDF} />
                    </Button>
                    {/* {!disableSubmit && feedback && (
                      <div className="site-card-wrapper">
                        <Card bordered={false}>
                          <StarRate disabled={true} value={feedback?.rate} />
                          <Button
                            className={`interested-button ${
                              feedback?.status === 1 ? 'status-selected' : null
                            }`}
                            icon={<StarOutlined />}
                          >
                            <FormattedMessage {...messages.interested} />
                          </Button>
                          <Button
                            className={`interested-button ${
                              feedback?.status === 2 ? 'status-selected' : null
                            }`}
                            icon={<MessageOutlined />}
                          >
                            <FormattedMessage {...messages.disccuss} />
                          </Button>
                        </Card>
                      </div>
                    )} */}
                    {/* {!disableSubmit && !feedback && (
                      <div className="site-card-wrapper">
                        <Card bordered={false}>
                          <StarRate disabled={true} value={0} />
                          <Button
                            className={`interested-button`}
                            icon={<StarOutlined />}
                          >
                            <FormattedMessage {...messages.interested} />
                          </Button>
                          <Button
                            className={`interested-button`}
                            icon={<MessageOutlined />}
                          >
                            <FormattedMessage {...messages.disccuss} />
                          </Button>
                        </Card>
                      </div>
                    )} */}
                    {/* {disableSubmit && (
                      <div className="site-card-wrapper">
                        <Card bordered={false}>
                          <StarRate
                            disabled={true}
                            classNames={classNames}
                            value={4}
                          />
                          <Button
                            className={`interested-button status-selected`}
                            icon={<StarOutlined />}
                          >
                            <FormattedMessage {...messages.interested} />
                          </Button>
                          <Button
                            className={`interested-button`}
                            icon={<MessageOutlined />}
                          >
                            <FormattedMessage {...messages.disccuss} />
                          </Button>
                        </Card>
                      </div>
                    )} */}
                  </div>
                </Col>
              </Row>

              {candidateInfo?.summaries?.length > 0 &&
                candidateInfo?.summaries.map((summary, index) => {
                  if (summary?.title && summary?.description) {
                    return (
                      <>
                        <Row
                          justify="center"
                          align="middle"
                          className={'font-title'}
                          key={index}
                        >
                          <Col
                            lg={24}
                            md={12}
                            sm={24}
                            xs={24}
                            xl={24}
                            className="text-left"
                          >
                            <Title level={1}>{summary.title}</Title>
                            <RawHtml html={summary.description} />
                          </Col>
                        </Row>
                      </>
                    );
                  }
                })}
            </Container>
          </ContainerBorder>

          {candidateInfo?.recruiter_assessments?.wheels &&
            candidateInfo?.recruiter_assessments?.wheels.length > 0 &&
            candidateInfo?.recruiter_assessments?.wheels.map(
              (competenceWheel, index) => {
                return isDisplay(competenceWheel?.competency_list) ? (
                  <>
                    <ContainerBorder key={index}>
                      <Container>
                        {
                          index === 0 && (
                            <Row justify="center" align="middle">
                              <Col
                                lg={24}
                                md={12}
                                sm={24}
                                xs={24}
                                xl={9}
                                className={'text-center font-title'}
                              >
                                <Title level={1}>Our Internal Assessment</Title>
                                <p>
                                  The competency wheels below showcase our internal
                                  assessment of the candidate's capabilities and
                                  alignment to the role requirements.
                                </p>
                              </Col>
                            </Row>
                          )
                        }
                        <Row justify="center" align="middle">
                          <Col
                            lg={24}
                            md={12}
                            sm={24}
                            xs={24}
                            xl={24}
                            className={'text-center font-title'}
                          >
                            <Title level={2}>
                              Competency Assessment
                              <span
                                style={{
                                  marginLeft: '10px',
                                  ...linkstyle,
                                }}
                              >
                                {competenceWheel?.wheel_name}
                              </span>
                            </Title>
                          </Col>
                        </Row>
                        {competenceWheel?.competency_list &&
                          competenceWheel?.competency_list?.length > 0 && (
                            <Row>
                              <Col lg={24} md={24} sm={24} xs={24} style={{ width: '80vw', minHeight: '300px' }}>
                                <RadarChart
                                  data={getRadarCompetencys(
                                    competenceWheel?.competency_list,
                                  )}
                                  colorLine={classNames?.radarColor}
                                  yMin={0}
                                  ymax={10}
                                />
                              </Col>
                            </Row>
                          )}
                      </Container>
                    </ContainerBorder>
                  </>
                ) : null;
              },
            )}

          {candidateInfo?.include_assessment_report &&
            assessmentReports.length > 0 &&
            assessmentReports.map((assessment, index) => {
              return (
                <>
                  {assessment?.PersonalityProfileReport &&
                    assessment?.PersonalityProfileReport.length > 0 && (
                      <ContainerBorder key={index}>
                        <Container>
                          <Row justify="center" align="middle">
                            <Col
                              lg={10}
                              md={12}
                              sm={24}
                              xs={12}
                              xl={12}
                              className="text-center font-title"
                            >
                              <Title level={1}>
                                External Assessment Outcomes
                              </Title>
                              <p>
                                To further assess the shortlisted candidate's
                                capabilities in the <br /> role, we had{' '}
                                {candidateInfo?.candidate_name} complete the
                                following assessments: TPAQ-27™ Express Personality Profile.
                              </p>
                              <Row justify="center">
                                <Col sl={12} style={{ marginRight: '10px' }}>
                                  <Title level={2}>
                                    Role level:&nbsp;
                                    <span style={linkstyle}>
                                      {assessment?.type?.name}
                                    </span>
                                  </Title>
                                </Col>
                                <Col sl={12}>
                                  <Title level={2}>
                                    Industry: &nbsp;
                                    <span style={linkstyle}>
                                      {assessment?.industry?.name}
                                    </span>
                                  </Title>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          {assessment?.PersonalityProfileReport && (
                            <>
                              <Row justify="center" align="middle">
                                <Col lg={24} md={12} sm={24} xs={24} xl={24}>
                                  <Title level={1} style={linkstyle}>
                                    1{`)`} Summary Personality Profile
                                  </Title>
                                  <p>
                                    Since it's sometimes impractical or
                                    unnecessary to analyse every one of the
                                    personality traits contained in the first
                                    section, this summary profile recasts the
                                    candidate’s personality traits in an
                                    aggregated, more tailored format for
                                    alternative interpretation.
                                  </p>
                                </Col>
                              </Row>

                              <Row>
                                <Col lg={24} md={24} sm={24} xs={24}>
                                  {assessment?.PersonalityProfileReport && (
                                    <RadarChart
                                      data={reversePersonalReport(
                                        assessment?.PersonalityProfileReport,
                                      )}
                                      xField={'Group'}
                                      yField={'RoundedStenScore'}
                                      colorLine={classNames?.linkColor}
                                      yMin={0}
                                      ymax={10}
                                    />
                                  )}
                                </Col>
                              </Row>
                            </>
                          )}
                        </Container>
                      </ContainerBorder>
                    )}

                  {assessment?.CompetencyProfileReport &&
                    assessment?.CompetencyProfileReport.length > 0 && (
                      <ContainerBorder>
                        <Container>
                          <Row justify="center" align="middle">
                            <Col
                              lg={10}
                              md={12}
                              sm={24}
                              xs={12}
                              xl={9}
                              className={'text-center font-title'}
                            >
                              <Title level={1}>Competency Profile</Title>
                              <p>
                                This section provides information regarding the
                                candidate’s predicted potential in accordance
                                with our full competency framework.
                              </p>
                            </Col>
                          </Row>
                          <>
                            <ProgessGroup
                              bgColor={classNames?.linkColor}
                              data={assessment?.CompetencyProfileReport}
                              name={'Group'}
                              rate={'RoundedStenScore'}
                            />
                          </>

                          <div
                            className="site-card-wrapper"
                            style={{ padding: '50px 0' }}
                          >
                            <Row gutter={16}>
                              <Col span={24}>
                                <Card
                                  bordered={false}
                                  className={`border-left-card ${clientReview &&
                                    `client-detail-report`}`}
                                >
                                  <Title level={1}>
                                    Detailed reports can be found here:
                                  </Title>
                                  <p>
                                    {`TPAQ-27™ Express Personality Profile: `}
                                    <a
                                      style={{ marginLeft: '10px' }}
                                      onClick={e =>
                                        handleDowloadAssessment(
                                          e,
                                          assessment?.assessment_id,
                                        )
                                      }
                                    >
                                      <DownloadOutlined
                                        style={{
                                          fontSize: '16px',
                                          marginRight: '5px',
                                        }}
                                      />
                                      Download
                                    </a>
                                  </p>
                                </Card>
                              </Col>
                            </Row>
                          </div>
                        </Container>
                      </ContainerBorder>
                    )}
                </>
              );
            })}

          {candidateInfo?.background_check && (
            <ContainerBorder>
              <Container className="checkbox-candidate">
                <Row justify="center" align="left">
                  <Col lg={24} md={24} sm={24} xs={24} xl={24}>
                    <Checkbox
                      checked={candidateInfo?.background_check}
                      className={`${clientReview && `client-review-check`}`}
                    >
                      <FormattedMessage {...messages.backgroundCheckLable} />
                    </Checkbox>
                  </Col>
                  {candidateInfo?.background_comment && (
                    <Col lg={24} md={24} sm={24} xs={24} xl={24}>
                      <p style={{ marginLeft: '25px', marginTop: '10px' }}>
                        {candidateInfo?.background_comment}
                      </p>
                    </Col>
                  )}
                </Row>
              </Container>
            </ContainerBorder>
          )}

          {candidateInfo?.right_to_work && (
            <ContainerBorder>
              <Container>
                <Row justify="center" align="left">
                  <Col lg={24} md={24} sm={24} xs={24} xl={24}>
                    <Checkbox
                      checked={candidateInfo?.right_to_work}
                      className={`${clientReview && `client-review-check`}`}
                    >
                      <FormattedMessage {...messages.rightToWork} />
                    </Checkbox>
                  </Col>
                  {candidateInfo?.right_to_work_comment && (
                    <Col lg={24} md={24} sm={24} xs={24} xl={24}>
                      <p style={{ marginLeft: '25px', marginTop: '10px' }}>
                        {candidateInfo?.right_to_work_comment}
                      </p>
                    </Col>
                  )}
                </Row>
              </Container>
            </ContainerBorder>
          )}

          {candidateInfo?.resume_text || candidateInfo?.linked_in_recommend ? (
            <ContainerBorder>
              <Container>
                {candidateInfo?.linked_in_recommend && (
                  <Row
                    justify="center"
                    align="left"
                    className={'border-bottom'}
                  >
                    <Col
                      lg={24}
                      md={24}
                      sm={24}
                      xs={24}
                      xl={24}
                      className="font-title"
                    >
                      <Title level={1}>
                        <FormattedMessage {...messages.linkedRecommendation} />
                      </Title>
                      <RawHtml html={candidateInfo?.linked_in_recommend} />
                    </Col>
                  </Row>
                )}

                {candidateInfo?.resume_text && (
                  <Row justify="center" align="left">
                    <Col
                      lg={24}
                      md={24}
                      sm={24}
                      xs={24}
                      xl={24}
                      className={'font-title'}
                    >
                      <Title level={1}>
                        <FormattedMessage {...messages.remuse} />
                      </Title>
                      <RawHtml
                        html={candidateInfo?.resume_text.replace(
                          /\n/g,
                          '<br />',
                        )}
                      />
                    </Col>
                  </Row>
                )}
              </Container>
            </ContainerBorder>
          ) : null}

          {showAdditionalInfos && (
            <ContainerBorder>
              <Container>
                <Row justify="center" align="left">
                  <Col
                    lg={24}
                    md={24}
                    sm={24}
                    xs={24}
                    xl={24}
                    className={'font-title'}
                  >
                    <Title level={1}>Additional candidate information</Title>
                    {candidateInfo.additional_infos.map((info, index) => {
                      if (info?.name && info?.value) {
                        return (
                          <p key={index}>
                            {info.name}:{' '}
                            {
                              <a
                                target="_blank"
                                style={linkstyle}
                                href={info.value}
                              >
                                {' '}
                                {info.value}
                              </a>
                            }
                          </p>
                        );
                      }
                    })}
                  </Col>
                </Row>
              </Container>
            </ContainerBorder>
          )}

          {candidateInfo?.documents?.length > 0 && (
            <ContainerBorder>
              <div className="sub-line">
                <Container>
                  <Row justify="center" align="left">
                    <Col
                      lg={24}
                      md={24}
                      sm={24}
                      xs={24}
                      xl={24}
                      className={'font-title'}
                    >
                      <Title level={1}>Candidate Resume</Title>
                      {candidateInfo?.documents.map((doc, index) => {
                        return (
                          <Row
                            xl={24}
                            key={index}
                            style={{ alignItems: 'center' }}
                          >
                            <span>{doc?.file_name}</span>
                            <a
                              onClick={e => {
                                e.preventDefault();
                                handleDowloadDocument(doc);
                              }}
                              style={linkstyle}
                            >
                              <DownloadOutlined
                                style={{
                                  fontSize: '16px',
                                  marginLeft: '10px',
                                  marginRight: '2px',
                                }}
                              />
                              Download
                            </a>
                          </Row>
                        );
                      })}
                    </Col>
                  </Row>
                </Container>
              </div>
            </ContainerBorder>
          )}

          <ClientFeedbackForm
            classNames={classNames}
            feedback={feedback}
            contactEmail={contactInfo?.email}
            onFeedback={() => handleFeedback()}
            interviewStatus={interviewStatus}
            onInterview={() => onInterview()}
            disableSubmit={disableSubmit}
            clientReview={clientReview}
            jobType={jobType}
          />
        </>
      )}
    </div>
  );
}

CandidateMainReport.propTypes = {
  candidateInfo: PropTypes.object,
  classNames: PropTypes.object,
  onFeedback: PropTypes.func,
  feedback: PropTypes.object,
  contactInfo: PropTypes.object,
  disableSubmit: PropTypes.bool,
  onDownload: PropTypes.func,
  onDownloadAssessment: PropTypes.func,
  onExport: PropTypes.func,
};

export default memo(CandidateMainReport);
