/**
 *
 * AdminAgencyDetails
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
import makeSelectAdminAgencyDetails from './selectors';
import reducer from './reducer';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout';
import ButtonBack from 'components/ButtonBack';
import { Button, Row, Col } from 'antd';
import AccountAdminDetail from 'components/AccountAdminDetail';
import SubscriptionInfoAdmin from 'components/SubscriptionInfoAdmin';
import AgencyAdminDetails from 'components/AgencyAdminDetails';
import { makeSelectAgencyById } from 'containers/common_provider/agency_list/selectors';
import { getArgencyList } from 'containers/common_provider/agency_list/actions';
import getAgencyInfo from 'containers/common_provider/get_agency_info/actions';
import { makeSelectAgencyInfo } from 'containers/common_provider/get_agency_info/selectors';
import getUserDefault from 'containers/common_provider/get_user_info/actions';
import { makeSelectUserInfo } from 'containers/common_provider/get_user_info/selectors';

export function AdminAgencyDetails(props) {
  const {
    history,
    onGetAgencyId,
    agencyById,
    onGetAdminAccount,
    adminAccount,
  } = props;
  const agencyId = props.match.params.id;
  const [isVerify, setIsVerify] = useState(null);
  const [isActive, setIsActive] = useState(null);

  useEffect(() => {
    onGetAgencyId(agencyId, {
      params: {
        show_statistic: true,
      },
    });
  }, []);
  useEffect(() => {
    if (agencyById) {
      const isVerify = agencyById?.created_by?.is_verify;
      const isActive = agencyById?.created_by?.is_active;
      setIsVerify(isVerify);
      setIsActive(isActive);
    }
  }, [agencyById]);

  useEffect(() => {
    onGetAdminAccount();
    return () => {};
  }, []);
  useInjectReducer({ key: 'adminAgencyDetails', reducer });

  // const subscriptionInfo = agencyById.subscription_plan

  return (
    <div>
      <Helmet>
        <title>AdminAgencyDetails</title>
        <meta name="description" content="Description of AdminAgencyDetails" />
      </Helmet>

      <MainLayout>
        <ButtonBack history={history} />
        <AgencyAdminDetails
          data={agencyById}
          history={history}
          agencyId={agencyId}
          isVerify={isVerify}
          isActive={isActive}
        />

        <div className="recruiter-information">
          <Row justify="space-between">
            <Col lg={12} md={12} sm={24} xs={24}>
              {
                <AccountAdminDetail
                  data={agencyById}
                  title={<FormattedMessage {...messages.accountAdmin} />}
                />
              }
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <SubscriptionInfoAdmin data={agencyById} history={history} />
            </Col>
          </Row>
        </div>
      </MainLayout>
    </div>
  );
}

AdminAgencyDetails.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  adminAgencyDetails: makeSelectAdminAgencyDetails(),
  agencyById: makeSelectAgencyInfo(),
  // agencyById: makeSelectAgencyById(),
  adminAccount: makeSelectUserInfo(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAgencyId: (id, params) => dispatch(getAgencyInfo(id, params)),
    onGetAdminAccount: () => dispatch(getUserDefault()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(AdminAgencyDetails);
