/**
 *
 * AgencyDetailsPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectAgencyDetailsPage from './selectors';
import reducer from './reducer';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout';
import ButtonBack from 'components/ButtonBack';
import { Button, Row, Col } from 'antd';
import RecruiterContactInfo from 'components/RecruiterContactInfo';
import getUserDefault from 'containers/common_provider/get_user_info/actions'
import { makeSelectUserInfo } from 'containers/common_provider/get_user_info/selectors';
import AgencyAdminDetails from 'components/AgencyAdminDetails'
import { makeSelectAgencyInfo } from 'containers/common_provider/get_agency_info/selectors';
import SubscriptionInfoAdmin from 'components/SubscriptionInfoAdmin'
import getAgencyInfo from 'containers/common_provider/get_agency_info/actions';
import AccountAdminDetail from 'components/AccountAdminDetail';



export function AgencyDetailsPage(props) {
  const {
    history,
    onGetAdminAccount,
    adminAccount,
    agencyById,
    onGetAgencyId
  } = props;
  const agencyId = props.match.params.id;
  useInjectReducer({ key: 'agencyDetailsPage', reducer });

  // useEffect(() => {
  //   onGetAdminAccount()
  //   return () => { }
  // }, [])

  useEffect(() => {
    console.log('a')
    onGetAgencyId(agencyId, {
      params: {
        show_statistic: true
      }
    })
  }, [])

  return (
    <div>
      <Helmet>
        <title>AgencyDetailsPage</title>
        <meta name="description" content="Description of AgencyDetailsPage" />
      </Helmet>
      <MainLayout>
        <div className="btn-back">
          <ButtonBack history={history} />
        </div>
        <AgencyAdminDetails
          data={agencyById}
          history={history}
          agencyId={agencyId}
        >

        </AgencyAdminDetails>

        <div className="recruiter-information">
          <Row justify="space-between">
            <Col lg={12} md={12} sm={24} xs={24}>
              {
                // adminAccount ? <RecruiterContactInfo data={adminAccount} recruiterId={agencyId} /> : null
                <AccountAdminDetail data={adminAccount} title={<FormattedMessage {...messages.accountAdmin} />} />

              }
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              {
                <SubscriptionInfoAdmin data={agencyById} history={history} />

              }
            </Col>
          </Row>
        </div>


      </MainLayout>
    </div>
  );
}

AgencyDetailsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  agencyDetailsPage: makeSelectAgencyDetailsPage(),
  adminAccount: makeSelectUserInfo(),
  agencyById: makeSelectAgencyInfo(),

});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAdminAccount: () => dispatch(getUserDefault()),
    onGetAgencyId: (id, params) => dispatch(getAgencyInfo(id, params)),


  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(AgencyDetailsPage);
