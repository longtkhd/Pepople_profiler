/**
 *
 * SubscriptionPlanConfrimModal
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import ConfirmModal from 'components/modals/ConfirmModal';
import messages from './messages';

import DowngradeNotiIcon from 'images/icons/combined-shape.png';

function SubscriptionPlanConfrimModal(props) {
  const {  onOk, planName} = props;
  const Content = () => {
    return (
      <p>
        <FormattedMessage
          {...messages.recommend}
        />
      </p>
    );
  };
  return (
    <ConfirmModal
      title={<FormattedMessage {...messages.title} />}
      icon={<img src={DowngradeNotiIcon} alt="downgrade-notification" />}
      content={<Content /> }
      okText={<FormattedMessage {...messages.ok} />}
      cancelButtonProps={{ style: { display: 'none' } }}
      onOk={onOk}
    />
  );
}

SubscriptionPlanConfrimModal.propTypes = {
  onOk: PropTypes.func,
  planName: PropTypes.string,
};

export default memo(SubscriptionPlanConfrimModal);
