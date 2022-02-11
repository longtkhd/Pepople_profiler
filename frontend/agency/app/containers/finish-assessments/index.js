/**
 *
 * FinishAssessmentsPage
 *
 */

import React, { useEffect, memo, useMemo } from 'react';
import qs from 'qs';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import MainLayout from 'components/layout/MainLayout';
import messages from './messages';
import { Col, Row } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { handleCandidateAssessmentAction } from './actions';


export function FinishAssessmentsPage(props) {
  const statusHeaderFinishAssessment = true;

  const { handleCandidateAssessment } = props;
  const params = qs.parse(location.search, { ignoreQueryPrefix: true });

  useEffect(() => {
    if (params) {
      handleCandidateAssessment(params);
    } else {
      return;
    }
  }, []);

  return (
    <div>
      <Helmet>
        <title>Assessment Invite</title>
        <meta
          name="description"
          content="Description of FinishAssessmentsPage"
        />
      </Helmet>
      <MainLayout status={statusHeaderFinishAssessment}>
        <Row className="setting-container" justify="center">
          <Col span={24}>
            <h1 style={{textAlign:'center'}}>
              <FormattedMessage {...messages.header} />
            </h1>
          </Col>
        </Row>
      </MainLayout>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    handleCandidateAssessment: params =>
      dispatch(handleCandidateAssessmentAction(params)),
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(FinishAssessmentsPage);
