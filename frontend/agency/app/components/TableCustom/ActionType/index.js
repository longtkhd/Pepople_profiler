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
import pdfIcon from 'images/book_icon.svg';
import {
  LockOutlined,
  EyeOutlined,
  FilePdfOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  FormOutlined,
  StarOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import SpanCustom from 'components/SpanCustom';

function ActionType(props) {
  // closeRole, view, pdf,invite, viewFeedback, delete, manage

  switch (props.type) {
    case 'closeRole':
      return (
        <div
          {...props}
          className={`action-type-btn action-type-common close-role`}
        >
          <SpanCustom className={'action-icon'}>
            <i className="fas fa-lock" />
          </SpanCustom>
          <FormattedMessage {...messages.closeRole} />
        </div>
      );
    case 'view':
      return (
        <div {...props} className={`action-type-btn action-type-common view`}>
          <SpanCustom className={'action-icon'}>
            <i className="fa fa-eye" aria-hidden="true" />
          </SpanCustom>
          <FormattedMessage {...messages.view} />
        </div>
      );
    case 'pdf':
      return (
        <div {...props} className={`action-type-btn action-type-common pdf`}>
          <SpanCustom className={'action-icon'}>
            <img src={pdfIcon} alt="image" />
          </SpanCustom>
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
        <div
          {...props}
          className={`action-type-btn action-type-common delete action-font`}
        >
          <SpanCustom className={'action-icon'}>
            <i className="far fa-trash-alt" />
          </SpanCustom>
          <FormattedMessage {...messages.delete} />
        </div>
      );
    case 'remove':
      return (
        <div
          {...props}
          className={`action-type-btn action-type-common delete action-font`}
        >
          <SpanCustom className={'action-icon'}>
            <i className="far fa-trash-alt" />
          </SpanCustom>
          <FormattedMessage {...messages.remove} />
        </div>
      );
    case 'manage':
      return (
        <div {...props} className={`action-type-btn action-type-common manage`}>
          <SpanCustom className={'action-icon'}>
            <i className="fas fa-edit" />
          </SpanCustom>
          <FormattedMessage {...messages.manage} />
        </div>
      );
    case 'download':
      return (
        <div {...props} className={`action-type-btn action-type-common manage`}>
          <SpanCustom className={'action-icon'}>
            <i className="fas fa-download" />
          </SpanCustom>
          <FormattedMessage {...messages.download} />
        </div>
      );
    case 'add':
      return (
        <div {...props} className={`action-type-btn action-type-common manage`}>
          <SpanCustom className={'action-icon'}>
            <i className="fas fa-plus" aria-hidden="true" />
          </SpanCustom>
          <FormattedMessage {...messages.add} />
        </div>
      );
    case 'edit':
      return (
        <div {...props} className={`action-type-btn action-type-common edit`}>
          <SpanCustom className={'action-icon'}>
            <i className="fas fa-edit" />
          </SpanCustom>
          <FormattedMessage {...messages.edit} />
        </div>
      );
    case 'reActivate':
      return (
        <div
          {...props}
          className={`action-type-btn action-type-common btn-small re-active`}
        >
          <FormattedMessage {...messages.reActivate} />
        </div>
      );
    case 'view2':
      return (
        <div {...props} className={`action-type-btn action-type-common view2`}>
          <EyeOutlined className={'action-icon'} />
          <FormattedMessage {...messages.view} />
        </div>
      );
    case 'interested':
      return (
        <div
          {...props}
          className={`action-type-btn action-type-common interested`}
        >
          <StarOutlined className={'action-icon'} />
          <FormattedMessage {...messages.interested} />
        </div>
      );
    case 'discuss':
      return (
        <div
          {...props}
          className={`action-type-btn action-type-common discuss`}
        >
          <CommentOutlined className={'action-icon'} />
          <FormattedMessage {...messages.discuss} />
        </div>
      );
    case 'revoke':
      return (
        <div
          {...props}
          className={`action-type-btn primary-outline action-type-common btn-small`}
        >
          <FormattedMessage {...messages.revokeClient} />
        </div>
      );
    default:
      return `Please add prop type in a array ex: ['closeRole','view',...]`;
  }
}

ActionType.propTypes = {};

export default memo(ActionType);
