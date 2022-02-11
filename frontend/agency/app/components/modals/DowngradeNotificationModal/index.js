/**
 *
 * Downgradenotification
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import InfoModal from 'components/modals/InfoModal';

import DowngradeNotiIcon from 'images/icons/combined-shape.png';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import globalMessages from 'messages';

function DowngradeNotificationModal(props) {
  const { onSuccess } = props;
  const Content = () => {
    return (
      <div style={{ width: '80%', margin: 'auto', fontSize: '16px' }}>
        <span>
          <FormattedMessage {...messages.error} />
        </span>
        <br />
        <br />
        <span>
          <FormattedMessage {...messages.suggestions} />
        </span>
      </div>
    );
  };
  return (
    <InfoModal
      icon={<img src={DowngradeNotiIcon} alt="downgrade-notification" />}
      title={<FormattedMessage {...messages.header} />}
      content={<Content />}
      okText={<FormattedMessage {...globalMessages.done} />}
      onOK={onSuccess}
    />
  );
}

DowngradeNotificationModal.propTypes = {
  onSuccess: PropTypes.func,
};

export default memo(DowngradeNotificationModal);
