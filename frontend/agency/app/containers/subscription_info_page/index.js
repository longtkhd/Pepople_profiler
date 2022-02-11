/**
 *
 * SubscriptionInfo
 *
 */

import React, { memo, useEffect, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import moment from 'moment';

import {
  makeSelectGetSubscriptionInfoLoading,
  makeSelectSubscriptionInfo,
  makeSelectGetSubscriptionInfoError,
  makeSelectGetPaymentHistoryResponse,
  makeSelectGetPaymentHistoryError,
  makeSelectGetPaymentHistoryLoading,
} from './selectors';
import reducer from './reducer';
import {
  getSubscription,
  cancelSubscription,
  getPaymentHistory,
  clearPaymentHistoryAction,
  clearSubscriptionInfoAction,
} from './actions';

import {
  makeSelectGetAgencyInfoLoading,
  makeSelectGetAgencyInfoError,
  makeSelectAgencyInfo,
} from '../common_provider/get_agency_info/selectors';

import getAgencyInfoAction, {
  clearAgencyInfoAction,
} from '../common_provider/get_agency_info/actions';

import { Row, Col, Button, Space, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

import FormInfoDetail from 'components/FormInfoDetail';
import MainLayout from 'components/layout/MainLayout';
import TableCustom from 'components/TableCustom';
import ButtonBack from 'components/ButtonBack';
import SubscriptionInfo from 'components/SubscriptionInfo';
import SpinnerLoading from 'components/SpinnerLoading';

import { openNotification } from 'utils/notification';
import { tokenDecoded } from 'utils/authHelper';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import './styles.less';
import { ContentModal } from '../../components/modals/ContentModal';
import NumberFormat from 'react-number-format';

export function SubscriptionInfoPage(props) {
  useInjectReducer({ key: 'subscriptionInfoPage', reducer });

  const {
    history,
    subscriptionInfoData,
    subScriptionInfoError,
    subScriptionInfoLoading,
    getSubscriptionInfo,
    agencyInfoResponse,
    agencyError,
    agencyLoading,
    getAgencyInfo,
    cancelSubscriptionInfo,
    onGetPaymentHistory,
    loadingPaymentHistory,
    errorPaymentHistory,
    paymentHistoryData,
    clearAgencyInfo,
    clearSubscriptionInfo,
    clearPaymentHistory,
  } = props;

  const columns = [
    {
      title: 'Plan level',
      dataIndex: 'plan_level',
      key: 'plan_level',
    },
    {
      title: 'Payment Date',
      dataIndex: 'payment_date',
      key: 'created_at',
    },
    {
      title: 'Payment Amount',
      dataIndex: 'payment_amount',
      key: 'payment_amount',
      render: (text, record) => (
        <p>
          <NumberFormat
            placeholder=""
            prefix="AUD $"
            thousandSeparator={true}
            displayType={'text'}
            value={record?.payment_amount}
          />
        </p>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <p>
          {record?.status && record.status === 1 ? `Failed` : 'Successfully'}
        </p>
      ),
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

  const [pageLoading, setPageLoading] = useState(false);
  const [cardInfo, setCardInfo] = useState();
  const [dataSource, setDataSource] = useState([]);

  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const handleChangePage = useCallback(async currentPage => {
    setCurrent(currentPage);
    await onGetPaymentHistory(infoAuth?.agency_id, {
      params: {
        page: currentPage,
        size: pageSize,
      },
    });
  }, []);

  const hanldeCancelSubscriptionInfo = () => {
    if (!infoAuth?.agency_id) return;
    cancelSubscriptionInfo(infoAuth?.agency_id);
  };

  const handleConfirmCancelSubscription = e => {
    e.preventDefault();
    Modal.confirm({
      centered: true,
      title: false,
      icon: false,
      className: 'nem-modal-confirm',
      content: (
        <ContentModal
          title={<FormattedMessage {...messages.modalCancelTitle} />}
          message={<FormattedMessage {...messages.modalCancelMessage} />}
        />
      ),
      okText: <FormattedMessage {...messages.modalButtonYes} />,
      cancelText: <FormattedMessage {...messages.modalButtonNo} />,
      cancelButtonProps: { className: 'modal-btn-cancel' },
      okButtonProps: { className: 'modal-btn-ok' },
      onOk() {
        hanldeCancelSubscriptionInfo();
      },
    });
  };

  useEffect(() => {
    setCurrent(1);
    return () => {
      clearAgencyInfo();
      clearPaymentHistory();
      clearSubscriptionInfo();
    };
  }, []);

  const infoAuth = useMemo(() => {
    return tokenDecoded('token') ? tokenDecoded('token') : null;
  }, [tokenDecoded]);

  useEffect(() => {
    const agencyId = infoAuth?.agency_id;
    if (agencyId) {
      getSubscriptionInfo(agencyId);
      getAgencyInfo(agencyId);
      onGetPaymentHistory(agencyId, {
        params: {
          page: current,
          size: pageSize,
        },
      });
    }
  }, [infoAuth]);

  useEffect(() => {
    if (agencyInfoResponse && agencyInfoResponse.payment_info) {
      setCardInfo({ ...agencyInfoResponse.payment_info });
    }
  }, [agencyInfoResponse]);

  useEffect(() => {
    if (paymentHistoryData && paymentHistoryData.list) {
      setTotal(paymentHistoryData?.total);
      const data = paymentHistoryData.list.map((payment, index) => {
        return {
          key: index,
          plan_level: payment?.package_id?.package_name,
          payment_date: moment(payment?.updated_at).format('DD MMM YYYY'),
          payment_amount: payment?.amount,
          status: payment?.status,
        };
      });
      setDataSource(data);
    }
  }, [paymentHistoryData]);

  useEffect(() => {
    const error = subScriptionInfoError || errorPaymentHistory || agencyError;
    if (error) {
      openNotification('error', error?.message);
    }
  }, [subScriptionInfoError, errorPaymentHistory, agencyError]);

  useEffect(() => {
    const loading =
      subScriptionInfoLoading || agencyLoading || loadingPaymentHistory;
    setPageLoading(loading);
  }, [subScriptionInfoLoading, agencyLoading, loadingPaymentHistory]);

  return (
    <div>
      <Helmet>
        <title>Subscription Info</title>
        <meta
          name="description"
          content="Description of Subscription Info Page"
        />
      </Helmet>
      <MainLayout>
        {pageLoading && <SpinnerLoading loading={pageLoading} />}
        {!subscriptionInfoData && (
          <ButtonBack onClick={() => history.push('/recruiter-list')} />
        )}
        <div className="sub-info__container">
          {!pageLoading && (
            <FormInfoDetail
              title={
                subscriptionInfoData && (
                  <FormattedMessage {...messages.subscriptionTitle} />
                )
              }
              actions={
                subscriptionInfoData && (
                  <Row>
                    <Col>
                      <Button className="btn-sub-manage">
                        <FormattedMessage {...messages.manageButton} />
                        <div className="overlay-invite">
                          <Link
                            to="/plans"
                            className="overlay-invite-link link-other"
                          >
                            <FormattedMessage {...messages.linkAnother} />
                          </Link>
                          <Link
                            to="#"
                            onClick={e => handleConfirmCancelSubscription(e)}
                            className="overlay-invite-link link-cancel"
                          >
                            <FormattedMessage {...messages.linkCancel} />
                          </Link>
                        </div>
                      </Button>
                    </Col>
                  </Row>
                )
              }
            >
              <SubscriptionInfo subInfo={subscriptionInfoData} />
            </FormInfoDetail>
          )}

          {!pageLoading && cardInfo && (
            <FormInfoDetail
              title={<FormattedMessage {...messages.paymentMethodTitle} />}
              actions={
                <Row>
                  <Col>
                    <Link
                      to="#"
                      className="link-payment-method"
                      onClick={e => {
                        e.preventDefault();
                        history.push({
                          pathname: '/payment-method',
                          state: {
                            isEditMode: true,
                          },
                        });
                      }}
                    >
                      <i className="icon-btn action-icon fas fa-edit" />
                      <FormattedMessage {...messages.editButton} />
                    </Link>
                  </Col>
                </Row>
              }
            >
              <div className="form-layout custom-form">
                <Row gutter={[16, 8]}>
                  <Col>
                    <div className="form-group">
                      <label className="form-label">Name on Card:</label>
                      <div className="field-text">{cardInfo.name}</div>
                    </div>
                  </Col>
                  <Col>
                    <div className="form-group">
                      <label className="form-label">Credit Card Number:</label>
                      <div className="field-text">
                        {cardInfo?.display_number}
                      </div>
                    </div>
                  </Col>
                  <Col>
                    {cardInfo?.expiry_year && (
                      <div className="form-group">
                        <label className="form-label">Expiry Date:</label>
                        <div className="field-text">
                          xx/
                          {cardInfo.expiry_year.toString().slice(2, 4)}
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
            </FormInfoDetail>
          )}

          <FormInfoDetail
            title={<FormattedMessage {...messages.paymentHistoryTitle} />}
          >
            <TableCustom
              dataSource={dataSource}
              columns={columns}
              paginateStyle={`paginate-custom-flex-end`}
              paginate={dataSource.length > 0}
              pagination={false}
              paginateOptions={{
                current: current,
                defaultPageSize: pageSize,
                total: total,
                onChange: handleChangePage,
              }}
            />
          </FormInfoDetail>
        </div>
      </MainLayout>
    </div>
  );
}

SubscriptionInfoPage.propTypes = {
  subscriptionInfoData: PropTypes.object,
  subScriptionInfoLoading: PropTypes.bool,
  subScriptionInfoError: PropTypes.object,
  getSubscriptionInfo: PropTypes.func,
  cancelSubscriptionInfo: PropTypes.func,
  getAgencyInfo: PropTypes.func,
  agencyError: PropTypes.object,
  agencyInfoResponse: PropTypes.object,
  agencyLoading: PropTypes.bool,
  paymentHistoryData: PropTypes.object,
  loadingPaymentHistory: PropTypes.bool,
  errorPaymentHistory: PropTypes.object,
  getPaymentHistory: PropTypes.func,
  clearAgencyInfo: PropTypes.func,
  clearPaymentHistory: PropTypes.func,
  clearSubscriptionInfo: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  subScriptionInfoLoading: makeSelectGetSubscriptionInfoLoading(),
  subscriptionInfoData: makeSelectSubscriptionInfo(),
  subScriptionInfoError: makeSelectGetSubscriptionInfoError(),
  agencyInfoResponse: makeSelectAgencyInfo(),
  agencyError: makeSelectGetAgencyInfoError(),
  agencyLoading: makeSelectGetAgencyInfoLoading(),
  loadingPaymentHistory: makeSelectGetPaymentHistoryLoading(),
  errorPaymentHistory: makeSelectGetPaymentHistoryError(),
  paymentHistoryData: makeSelectGetPaymentHistoryResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    getSubscriptionInfo: agencyId => {
      dispatch(getSubscription(agencyId));
    },
    getAgencyInfo: agencyId => {
      dispatch(getAgencyInfoAction(agencyId));
    },
    onGetPaymentHistory: (agencyId, params) => {
      dispatch(getPaymentHistory(agencyId, params));
    },
    cancelSubscriptionInfo: agencyId => {
      dispatch(cancelSubscription(agencyId));
    },
    clearAgencyInfo: () => dispatch(clearAgencyInfoAction()),
    clearPaymentHistory: () => dispatch(clearPaymentHistoryAction()),
    clearSubscriptionInfo: () => dispatch(clearSubscriptionInfoAction()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(SubscriptionInfoPage);
