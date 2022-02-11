/**
 *
 * DashboardPage
 *
 */

import React, { memo, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import styled from 'styled-components';
import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectDashboardPage,
  makeSelectDashboardPageResponse,
  makeSelectParsingPageResponse,
  makeSelectAssessmentResponse,
  makeSelectSubscriptionResponse,
  makeSelectDashboardPageLoading,
} from './selectors';
import reducer from './reducer';
import messages from './messages';
import getUserCountDefault from './actions';
import SectionWrapper from 'components/SectionWrapper';
import ButtonCustom from 'components/atoms/Button';
import PieChart from 'components/PieChart/Loadable';
import BarChart from 'components/BarChart/Loadable';
import SpinnerLoading from 'components/SpinnerLoading/index';
import MainLayout from 'components/layout/MainLayout';
import { Row, Col } from 'antd';
import { getArgencyList } from 'containers/common_provider/agency_list/actions';
import { makeSelectArgencyInfo } from 'containers/common_provider/agency_list/selectors';
import FormAtnd from 'components/BarChart/FormAntd';

import { getCountSubscriptionDefault } from './actions';

import './styles.less';

const Container = styled.div`
  max-width: 1140px;
  width: 100%;
  margin: 0 auto;
`;

const TotalWrapper = styled.div`
  width: 300px;
  margin: 0 auto;
`;
const Heading = styled.h1`
  text-align: center;
  font-weight: bold;
  color: #32363e;
`;

export function DashboardPage(props) {
  const {
    history,
    onGetUserCount,
    userCountData,
    onGetAgency,
    agencyData,
    parsingData,
    assessmentData,
    onGetSubscription,
    subscriptionData,
    pageLoading
  } = props;

  const agencyList = useMemo(() => {
    return agencyData?.list || [];
  }, [agencyData]);

  const totalCv = useMemo(() => {
    return parsingData?.totalCvParsing || 0;
  }, [parsingData]);

  const CvData = useMemo(() => {
    return parsingData?.topCvParsing || [];
  }, [parsingData]);

  const AssessmentData =  useMemo(() => {
    return assessmentData?.topAssessmentReport || [];
  }, [assessmentData]);

  const totalAssessment = useMemo(() => {
    return assessmentData?.totalAssessmentReports;
  }, [assessmentData]);

  console.log(totalAssessment)
  console.log(assessmentData)


  const SubscriptionData = useMemo(() => {
    let pieDatas = [
      {
        value: subscriptionData?.freeTrial,
        label: 'Free trial',
        // color: "hsl(181, 70%, 50%)",
        id: 'freeTrial',
      },
      {
        value: subscriptionData?.noSubscription,
        label: 'No subscription',
        id: 'noSubscription',
      },
    ];
    subscriptionData &&
      subscriptionData?.countSubscriptionType?.map((x, index) => {
        pieDatas.push({
          value: x?.count,
          label: x?._id?.package_name,
          id: x?._id?.package_name,
        });
      });
    return pieDatas;
  });

  const totalPercent = useMemo(() => {
    let totals = 0;
    SubscriptionData &&
      SubscriptionData.map((x, index) => {
        totals += x?.value;
      });
    return totals;
  }, [SubscriptionData]);
  const [agency, setAgency] = useState(null);

  useInjectReducer({ key: 'dashboardPage', reducer });

  useEffect(() => {
    onGetUserCount();
  }, []);

  useEffect(() => {
    if (userCountData) {
      setAgency(userCountData);
    }
  });

  useEffect(() => {
    onGetAgency({
      params: {
        paginate: false,
      },
    });
  }, []);

  useEffect(() => {
    onGetSubscription();
  }, []);

  console.log(totalAssessment);

  return (
    <div>
      <Helmet>
        <title>DashboardPage</title>
        <meta name="description" content="Description of DashboardPage" />
      </Helmet>
      {/* <FormattedMessage {...messages.header} /> */}
      <MainLayout>
        {pageLoading && <SpinnerLoading loading={pageLoading}/>}
        <SectionWrapper>
          <Container>
            <TotalWrapper>
              <Row justify="space-between" className="mb-2">
                <Col>
                  <div className="block-analytic">
                    <div className="analytic-label">
                      <FormattedMessage {...messages.agencies} />
                    </div>
                    <div className="analytic-number">{agency?.agency}</div>
                  </div>
                </Col>
                <Col>
                  <div className="block-analytic">
                    <div className="analytic-label">
                      <FormattedMessage {...messages.users} />
                    </div>
                    <div className="analytic-number">{agency?.recruiter}</div>
                  </div>
                </Col>
              </Row>
              <Row justify="center">
                <Col>
                  <ButtonCustom
                    className="view-agencies btn-primary-gradient"
                    onClick={() => history.push('/admin-agency-list')}
                  >
                    <FormattedMessage {...messages.viewAgen} />
                  </ButtonCustom>
                </Col>
              </Row>
            </TotalWrapper>
          </Container>
        </SectionWrapper>
        <SectionWrapper>
          <Container>
            <Heading className="title-chart">Subscription type</Heading>
            <PieChart data={SubscriptionData} total={totalPercent} />
          </Container>
        </SectionWrapper>

        <SectionWrapper>
          <Container>
            <Heading className="title-chart">CV Parsing</Heading>
            <FormAtnd data={agencyList} name={'Cvparsing'} />
            <BarChart
              total={totalCv}
              chartData={CvData}
              labels={<FormattedMessage {...messages.top10Cv} />}
              totalLabel={<FormattedMessage {...messages.totalCv} />}
            />
          </Container>
        </SectionWrapper>
        <SectionWrapper>
          <Container>
            <Heading className="title-chart">Talent Assessment Usage</Heading>
            <FormAtnd data={agencyList} name={'assessment'} />
            <BarChart
              total={totalAssessment}
              chartData={AssessmentData}
              labels={<FormattedMessage {...messages.top10Assessment} />}
              totalLabel={<FormattedMessage {...messages.totalAssessment} />}
            />
          </Container>
        </SectionWrapper>
      </MainLayout>
    </div>
  );
}

DashboardPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  dashboardPage: makeSelectDashboardPage(),
  userCountData: makeSelectDashboardPageResponse(),
  agencyData: makeSelectArgencyInfo(),
  parsingData: makeSelectParsingPageResponse(),
  assessmentData: makeSelectAssessmentResponse(),
  subscriptionData: makeSelectSubscriptionResponse(),
  pageLoading: makeSelectDashboardPageLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetUserCount: () => dispatch(getUserCountDefault()),
    onGetAgency: params => dispatch(getArgencyList(params)),
    onGetSubscription: params => dispatch(getCountSubscriptionDefault(params)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(DashboardPage);
