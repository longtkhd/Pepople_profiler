/**
 *
 * ActionGroup
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import './styles.less';
import {
  LockOutlined,
  EyeOutlined,
  FilePdfOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  StopOutlined,
  SyncOutlined

} from '@ant-design/icons';

function ActionType(props) {
  // closeRole, view, pdf,invite, viewFeedback, delete, manage

  switch (props.type) {
    case 'closeRole':
      return (
        <div
          {...props}
          className={`action-type-btn action-type-common close-role`}
        >
          <LockOutlined className={'action-icon'} />
          <FormattedMessage {...messages.closeRole} />
        </div>
      );
    case 'view':
      return (
        <div {...props} className={`action-type-btn action-type-common view`}>
          <EyeOutlined className={'action-icon'} />
          <FormattedMessage {...messages.view} />
        </div>
      );
    case 'pdf':
      return (
        <div {...props} className={`action-type-btn action-type-common pdf`}>
          <FilePdfOutlined className={'action-icon'} />
          <FormattedMessage {...messages.pdf} />
        </div>
      );
    case 'invite':
      return (
        <div
          {...props}
          className={`action-type-btn primary-outline action-type-common btn-small`}
        >
          <FormattedMessage {...messages.invite} />
        </div>
      );
    case 'feedback':
      return (
        <div
          {...props}
          className={`action-type-btn secondary-outline action-type-common btn-small`}
        >
          <FormattedMessage {...messages.feedback} />
        </div>
      );
    case 'delete':
      return (
        <div {...props} className={`action-type-btn action-type-common delete`}>
          <DeleteOutlined className={'action-icon'} />
          <FormattedMessage {...messages.delete} />
        </div>
      );
    case 'manage':
      return (
        <div {...props} className={`action-type-btn action-type-common manage`}>
          <EditOutlined className={'action-icon'} />
          <FormattedMessage {...messages.manage} />
        </div>
      );
    case 'add':
      return (
        <div {...props} className={`action-type-btn action-type-common manage`}>
          <PlusOutlined className={'action-icon'} />
          <FormattedMessage {...messages.add} />
        </div>
      );
    case 'edit':
      return (
        <div {...props} className={`action-type-btn action-type-common edit`}>
          <EditOutlined className={'action-icon'} />
          <FormattedMessage {...messages.edit} />
        </div>
      );
    case 'Deactive':
      return (
        <div {...props} className={`action-type-btn action-type-common deactive`}>
          <StopOutlined className={'action-icon'} />
          <FormattedMessage {...messages.deactive} />
        </div>
      );
    case 'Refresh':
      return (
        <div {...props} className={`action-type-btn action-type-common refresh`}>
          <SyncOutlined className={'action-icon'} />
          <FormattedMessage {...messages.refresh} />
        </div>
      );
    default:
      return `Please add prop type in a array ex: ['closeRole','view',...]`;
  }
}

ActionType.propTypes = {};

export default memo(ActionType);
