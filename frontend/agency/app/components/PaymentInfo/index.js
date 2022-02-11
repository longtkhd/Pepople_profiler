/**
 *
 * PaymentInfo
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import moment from 'moment';

import verifyCardAction from 'containers/common_provider/verify_card_setup/actions';
import { makeSelectVerifyCardError, makeSelectVerifyCardResponse } from 'containers/common_provider/verify_card_setup/selectors';

import { Row, Col } from 'antd';
import HighlightText from 'components/atoms/HighlightText';
import PaymentInfoForm from 'components/PaymentInfoForm';
import PaymentSuccessModal from 'components/modals/PaymentSuccessModal';
import { openNotification } from 'utils/notification';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './styles.less';

import messages from './messages';
import { FormattedMessage } from 'react-intl';
import { CONFIG } from 'constants/config';

const NOTIFICATION_TYPES = CONFIG.NOTIFICATION_TYPES;

function PaymentInfo(props) {
  const {
    socket,
    user,
    setupToken,
    onDone,
    onVerifyCard,
    verifyCardError,
    verifyCardResponse,
    onSkipPayment,
    onBack
  } = props;

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const verifyCard = (data) => {
    if (!user || !setupToken) {
      openNotification('error', 'User Not Found');
    } else {
      onVerifyCard(setupToken.accessToken, user.agency_id, data);
    }
  }

  const skipPayment = () => {
    onSkipPayment();
  }

  useEffect(() => {
    if (verifyCardError) {
      openNotification('error', verifyCardError.message);
      setShowSuccessModal(false);
    }
    return () => { }
  }, [verifyCardError])

  useEffect(() => {
    if (verifyCardResponse) {
      setShowSuccessModal(true);
    }
    return () => { }
  }, [verifyCardResponse])

  useEffect(() => {
    return () => { }
  }, []);

  return (
    <div className="payment-info-container">
      <div className="text-center">
        <div className="title">
          <span className="title-line-1">
            <FormattedMessage {...messages.title1} />
          </span>
          <HighlightText>
            <FormattedMessage {...messages.title2} />
          </HighlightText>
        </div>
        <div className="helper">
          <FormattedMessage {...messages.helper} /> &nbsp;<HighlightText>{moment().add(14, 'days').format("Do MMMM, YYYY")}</HighlightText>
        </div>
      </div>
      <div className="description">
        <Row>
          <Col md={8}>
            <div className="description-col">
              <div className="description-item">
                <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />
                <FormattedMessage {...messages.description1} />
              </div>
              <div className="description-item">
                <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />
                <FormattedMessage {...messages.description2} />
              </div>
            </div>
          </Col>
          <Col md={16}>
            <div className="description-col">
              <div className="description-item">
                <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />
                <FormattedMessage {...messages.description3} />
              </div>
              <div className="description-item">
                <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />
                <FormattedMessage {...messages.description4} />
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className="payment-form-container mt-24">
        <PaymentInfoForm 
          showTermAndCondition={true} 
          onVerifyCard={verifyCard} 
          onSkipPayment={skipPayment}
          onBack={onBack}
        />
      </div>
      {showSuccessModal ? <PaymentSuccessModal onSuccess={onDone} /> : null}
    </div>
  );
}

PaymentInfo.propTypes = {
  user: PropTypes.object,
  setupToken: PropTypes.object,
  onDone: PropTypes.func,
  onVerifyCard: PropTypes.func,
  verifyCardError: PropTypes.object,
  verifyCardResponse: PropTypes.object,
  onSkipPayment: PropTypes.func,
  onBack: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  verifyCardError: makeSelectVerifyCardError(),
  verifyCardResponse: makeSelectVerifyCardResponse(),
})

function mapDispatchToProps(dispatch) {
  return {
    onVerifyCard: (accessToken, agencyId, data) => dispatch(verifyCardAction(accessToken, agencyId, data)),
  }
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(PaymentInfo);
