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
    case 'open':
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
    case 6:
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
    case 'notinvitedyet':
      return (
        <span className={`status theme-warning`}>
          <FormattedMessage {...messages.notinvitedyet} />
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
