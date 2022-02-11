/**
 *
 * AdminUpdatePaymentMethod
 *
 */

import React, { memo, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';

import MainLayout from 'components/layout/MainLayout';
import ButtonBack from 'components/ButtonBack';
import SpinnerLoading from 'components/SpinnerLoading';
import PaymentEditForm from 'components/PaymentEditForm';

import {
  makeSelectGetAgencyInfoLoading,
  makeSelectGetAgencyInfoError,
  makeSelectAgencyInfo,
} from '../common_provider/get_agency_info/selectors';
import getAgencyInfoAction from '../common_provider/get_agency_info/actions';

import {
  makeSelectUpdateCardLoading,
  makeSelectUpdateCardResponse,
  makeSelectUpdateCardError,
  makeSelectVerifyCardLoading,
  makeSelectVerifyCardResponse,
  makeSelectVerifyCardError,
} from '../common_provider/verify_card/selectors';

import verifyCardAction, {
  updatePaymentMethodAction, clearUpdateCardAction
} from '../common_provider/verify_card/actions';

import { getUserInfo } from 'services/authentication';
import { openNotification } from 'utils/notification';

import messages from './messages';
import './styles.less';
import { Col, Row } from 'antd';
import { CONFIG } from 'constants/config';

const NOTIFICATION_TYPES = CONFIG.NOTIFICATION_TYPES;

export function AdminUpdatePaymentMethod(props) {
  const {
    socket,
    history,
    location,
    agencyInfoResponse,
    errorAgency,
    loadingAgency,
    getAgencyInfo,
    onVerifyCard,
    verifyCardLoading,
    verifyCardResponse,
    verifyCardError,
    onUpdateCard,
    updateCardLoading,
    updateCardResponse,
    updateCardError,
    clearUpdateCard,
  } = props;

  const [cardInfo, setCardInfo] = useState();
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = getUserInfo();

  const handleVerifyCard = data => {
    if (user) onVerifyCard(user.agency_id, data);
  };

  const handleUpdateCard = data => {
    if (user) onUpdateCard(user.agency_id, data);
  };

  const isEditMode = useMemo(() => {
    return location?.state?.isEditMode || false;
  }, [location?.state?.isEditMode]);

  useEffect(() => {
    return () => {
      clearUpdateCard();
    }
  }, []);

  useEffect(() => {
    if (agencyInfoResponse && agencyInfoResponse.payment_info) {
      setCardInfo({ ...agencyInfoResponse.payment_info });
    }
  }, [agencyInfoResponse]);

  useEffect(() => {
    if (verifyCardResponse) {
      openNotification('success', 'Payment medthod successfully created.');
      setCardInfo({ ...verifyCardResponse.payment_info });
    }
  }, [verifyCardResponse]);

  useEffect(() => {
    if (updateCardResponse) {
      openNotification('success', 'Payment medthod successfully updated.');
      setCardInfo({ ...updateCardResponse.payment_info });
    }
  }, [updateCardResponse]);

  useEffect(() => {
    const error = updateCardError || verifyCardError;
    if (error) {
      openNotification('error', error.message || 'Payment medthod unsuccessfully updated!');
    }
  }, [updateCardError, verifyCardError]);

  useEffect(() => {
    if (errorAgency) {
      openNotification('error', error.message);
    }
  }, [errorAgency]);

  useEffect(() => {
    const loading = loadingAgency || verifyCardLoading || updateCardLoading;
    setIsLoading(loading);
  }, [loadingAgency, verifyCardLoading, updateCardLoading]);

  useEffect(() => {
    if (userInfo) {
      setUser(userInfo);
      const agencyId = userInfo.agency_id;
      if (agencyId) {
        getAgencyInfo(agencyId);
      }
    }
    return () => { }
  }, []);

  return (
    <div>
      <Helmet>
        <title>Payment Method Settings</title>
        <meta
          name="description"
          content="Description of Update Payment Method"
        />
      </Helmet>
      <MainLayout
        contentStyles={{
          backgroundColor: '#ffffff',
          padding: '10px 0px'
        }}
      >
        <ButtonBack history={history} style={{marginLeft: '30px'}}/>
        {isLoading && <SpinnerLoading loading={isLoading} />}

        {!isLoading && (
          <>
            <Row className="payment-info-container">
              <Col span={24}>
                <h1>
                  <FormattedMessage {...messages.header} />
                </h1>
                {cardInfo && (
                  <PaymentEditForm
                    cardInfo={cardInfo}
                    onUpdateCard={handleUpdateCard}
                    isEditMode={isEditMode}
                  />
                )}
                {!cardInfo && (
                  <PaymentEditForm
                    onVerifyCard={handleVerifyCard}
                  />
                )}
              </Col>
            </Row>
          </>
        )}
      </MainLayout>
    </div>
  );
}

AdminUpdatePaymentMethod.propTypes = {
  agencyInfoResponse: PropTypes.object,
  errorAgency: PropTypes.object,
  loadingAgency: PropTypes.bool,
  updateCardLoading: PropTypes.bool,
  updateCardResponse: PropTypes.object,
  updateCardError: PropTypes.object,
  verifyCardLoading: PropTypes.bool,
  verifyCardResponse: PropTypes.object,
  verifyCardError: PropTypes.object,
  getAgencyInfo: PropTypes.func,
  onVerifyCard: PropTypes.func,
  onUpdateCard: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  agencyInfoResponse: makeSelectAgencyInfo(),
  errorAgency: makeSelectGetAgencyInfoError(),
  loadingAgency: makeSelectGetAgencyInfoLoading(),
  updateCardLoading: makeSelectUpdateCardLoading(),
  updateCardResponse: makeSelectUpdateCardResponse(),
  updateCardError: makeSelectUpdateCardError(),
  verifyCardLoading: makeSelectVerifyCardLoading(),
  verifyCardResponse: makeSelectVerifyCardResponse(),
  verifyCardError: makeSelectVerifyCardError(),
});

function mapDispatchToProps(dispatch) {
  return {
    getAgencyInfo: agencyId => dispatch(getAgencyInfoAction(agencyId)),
    onVerifyCard: (agencyId, data) =>
      dispatch(verifyCardAction(agencyId, data)),
    onUpdateCard: (agencyId, data) =>
      dispatch(updatePaymentMethodAction(agencyId, data)),
    clearUpdateCard: () => dispatch(clearUpdateCardAction()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(AdminUpdatePaymentMethod);
