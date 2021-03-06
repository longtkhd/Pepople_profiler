/**
 *
 * NotificationSettingItem
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function NotificationSettingItem() {
  return (
    <div>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

NotificationSettingItem.propTypes = {};

export default memo(NotificationSettingItem);
