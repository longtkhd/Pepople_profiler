/**
 *
 * AdminUserDetails
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
import makeSelectAdminUserDetails from './selectors';
import reducer from './reducer';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout'
import ButtonBack from 'components/ButtonBack';
import { Button, Row, Col } from 'antd';
import AccountAdminDetail from 'components/AccountAdminDetail';
import AdminJobDetail from 'components/AdminJobDetail'
import getRecruiterInfo from 'containers/common_provider/get_recruiter_details/actions'
import { makeSelectRecruiterDetails } from 'containers/common_provider/get_recruiter_details/selectors'

export function AdminUserDetails(props) {
  const {
    history,
    onGetRecruiterInfo,
    recruiterInfo


  } = props;

  const recruiterId = props.match.params.id;
  useInjectReducer({ key: 'adminUserDetails', reducer });



  useEffect(() => {
    onGetRecruiterInfo(recruiterId, {
      params: {
        populate_statistic: true
      }
    });
  }, [])



  return (
    <div>
      <Helmet>
        <title>AdminUserDetails</title>
        <meta name="description" content="Description of AdminUserDetails" />
      </Helmet>
      <MainLayout>

        <ButtonBack history={history} />

        <div className="recruiter-information">
          <Row justify="space-between">
            <Col lg={12} md={12} sm={24} xs={24}>

              {
                <AccountAdminDetail role='recruiter' data={recruiterInfo} title={<FormattedMessage {...messages.contactInfo} />} />
              }
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>

              <AdminJobDetail data={recruiterInfo} title={<FormattedMessage {...messages.jobDetails} />} />


            </Col>
          </Row>
        </div>

      </MainLayout>
    </div>
  );
}

AdminUserDetails.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  adminUserDetails: makeSelectAdminUserDetails(),
  recruiterInfo: makeSelectRecruiterDetails()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetRecruiterInfo: (id, params) => dispatch(getRecruiterInfo(id, params)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(AdminUserDetails);
