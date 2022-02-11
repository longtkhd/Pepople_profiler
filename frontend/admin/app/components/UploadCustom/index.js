/**
 *
 * UploadCustom
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function UploadCustom() {
  return (
    <div>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

UploadCustom.propTypes = {};

export default memo(UploadCustom);
