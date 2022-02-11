/**
 *
 * PaymentHistoryInfo
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
import makeSelectPaymentHistoryInfo from './selectors';
import reducer from './reducer';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout'
import ButtonBack from 'components/ButtonBack'
import FormInfoDetail from 'components/FormInfoDetail';
import TableCustom from 'components/TableCustom';
import { Row, Col, Space } from 'antd'
import { Link } from 'react-router-dom';
import SubscriptionInfo from 'components/SubscriptionInfo';
import getSubscriptionDefault from 'containers/common_provider/subscription_sumary/actions'
import { makeSelectSubscriptionSumaryInfo } from 'containers/common_provider/subscription_sumary/selectors'
import getPaymentHistoryDefault from 'containers/common_provider/payment_history/actions'
import { makeSelectPaymentHistoryResponse } from 'containers/common_provider/payment_history/selectors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { text } from '@fortawesome/fontawesome-svg-core';
import moment from 'moment'
export function PaymentHistoryInfo(props) {
  const {
    history,
    onGetSubscription,
    subscriptionData,
    onGetPaymentInfo,
    paymentHistory
  } = props;
  const paymentData = paymentHistory?.list
  useEffect(() => {
    console.log(paymentData)
  })

  const columns = [
    {
      title: 'Plan level',
      dataIndex: 'package_id',
      key: 'plan_level',
      render: text => <p>{text.package_name}</p>,

    },
    {
      title: 'Payment Date',
      dataIndex: 'created_at',
      key: 'payment_date',
      render: text => <p>{moment(text).format('LLL')}</p>,
    },
    {
      title: 'Payment Amount',
      dataIndex: 'amount',
      key: 'payment_amount',
    },
    {
      title: 'Action',
      width: '100px',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <div className="table-action">
            <Link to="#">
              <div style={{ color: '#ffa800', size: 12 }}>
                <FontAwesomeIcon icon={faBook} style={{ marginRight: '5px' }} />
                PDF
              </div>
            </Link>
          </div>
        </Space>
      ),
    },
  ];

  const agencyId = props.match.params.id;


  useInjectReducer({ key: 'paymentHistoryInfo', reducer });

  useEffect(() => {

    onGetSubscription(agencyId)
    return () => { }
  }, [])

  useEffect(() => {
    onGetPaymentInfo(agencyId)
    return () => { }

  }, [])

  return (
    <div>
      <Helmet>
        <title>PaymentHistoryInfo</title>
        <meta name="description" content="Description of PaymentHistoryInfo" />
      </Helmet>
      <MainLayout>
        <div className="btn-back">
          <ButtonBack history={history} />
        </div>

        <FormInfoDetail
          title={<FormattedMessage {...messages.subscriptionTitle} />}
        >
          <SubscriptionInfo subInfo={subscriptionData} />


        </FormInfoDetail>

        <FormInfoDetail
          title={<FormattedMessage {...messages.paymentHistoryTitle} />}
        >
          <TableCustom columns={columns} dataSource={paymentData} />
        </FormInfoDetail>

      </MainLayout>
    </div>
  );
}

PaymentHistoryInfo.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  paymentHistoryInfo: makeSelectPaymentHistoryInfo(),
  subscriptionData: makeSelectSubscriptionSumaryInfo(),
  paymentHistory: makeSelectPaymentHistoryResponse()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetSubscription: (agencyId) => dispatch(getSubscriptionDefault(agencyId)),
    onGetPaymentInfo: (agencyId) => dispatch(getPaymentHistoryDefault(agencyId))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(PaymentHistoryInfo);
