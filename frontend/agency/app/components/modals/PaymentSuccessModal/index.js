/**
 *
 * PaymentSuccessModal
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import InfoModal from 'components/modals/InfoModal';
import HighlightText from 'components/atoms/HighlightText';

import CreditCardImg from 'images/icons/credit-card.png'

import messages from './messages';
import globalMessages from 'messages';
import { FormattedMessage } from 'react-intl';

function PaymentSuccessModal(props) {
  const { onSuccess } = props
  const Title = () => {
    return (
      <>
        <span><FormattedMessage {...messages.creditCard} /></span> &nbsp;
        <HighlightText><FormattedMessage {...messages.verified} /></HighlightText>
      </>
    )
  }
  return <InfoModal
    icon={<img src={CreditCardImg} alt="credit-card-message" />}
    title={(<Title />)}
    content={<FormattedMessage {...messages.paymentMethod} />}
    okText={<FormattedMessage {...globalMessages.done} />}
    onOK={onSuccess}
  />
}

PaymentSuccessModal.propTypes = {
  onSuccess: PropTypes.func
};

export default memo(PaymentSuccessModal);
