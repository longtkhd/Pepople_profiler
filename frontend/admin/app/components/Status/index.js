/**
 *
 * Status
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import './styles.less';

function Status({ type }) {
  switch (type) {
    case 1:
      return (
        <span className={`status theme-warning`}>
          <FormattedMessage {...messages.open} />
        </span>
      );
    case 'progress':
      return (
        <span className={`status theme-warning`}>
          <FormattedMessage {...messages.progress} />
        </span>
      );
    case 'submitted':
      return (
        <span className={`status theme-primary`}>
          <FormattedMessage {...messages.submitted} />
        </span>
      );
    case 'received':
      return (
        <span className={`status theme-danger`}>
          <FormattedMessage {...messages.received} />
        </span>
      );
    case 5:
      return (
        <span className={`status theme-secondary`}>
          <FormattedMessage {...messages.closed} />
        </span>
      );
    case 'successful':
      return (
        <span className={`status theme-primary`}>
          <FormattedMessage {...messages.successful} />
        </span>
      );
    case 'missing':
      return (
        <span className={`status theme-warning`}>
          <FormattedMessage {...messages.missing} />
        </span>
      );
    case 'missing2':
      return (
        <span className={`status theme-danger`}>
          <FormattedMessage {...messages.missing} />
        </span>
      );
    case 'inviteYet':
      return (
        <span className={`status theme-warning`}>
          <FormattedMessage {...messages.invitedYet} />
        </span>
      );
    case 'completed':
      return (
        <span className={`status theme-secondary`}>
          <FormattedMessage {...messages.completed} />
        </span>
      );
    case 'invited':
      return (
        <span className={`status theme-primary`}>
          <FormattedMessage {...messages.invited} />
        </span>
      );
    case 'registering':
      return (
        <span className={`status theme-warning w-status`}>
          <FormattedMessage {...messages.registering} />
        </span>
      );
    case 'active':
      return (
        <span className={`status theme-primary w-status`}>
          <FormattedMessage {...messages.active} />
        </span>
      );
    case 'deactive':
      return (
        <span className={`status theme-secondary w-status`}>
          <FormattedMessage {...messages.deactive} />
        </span>
      );
    default:
      return;
  }
  // return (
  //   <div>
  //     <FormattedMessage {...messages.header} />
  //   </div>
  // );
}

Status.propTypes = {};

export default memo(Status);
