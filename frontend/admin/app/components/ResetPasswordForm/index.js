/**
 *
 * ResetPasswordForm
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Title from 'components/atoms/Title'
import './styles.less'

function ResetPasswordForm() {
  return (
    <div className="admin-reset-form">
      <div className="reset-pass-title">
        <Title>
          Reset Password
      </Title>

      </div>

    </div>
  );
}

ResetPasswordForm.propTypes = {};

export default memo(ResetPasswordForm);
