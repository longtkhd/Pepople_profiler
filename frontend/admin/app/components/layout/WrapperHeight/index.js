/**
 *
 * WrapperHeight
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import './styles.less'

function WrapperHeight(props) {
  const { children } = props;
  return (

    <div className="h100">
      {children}
    </div>

  );
}

WrapperHeight.propTypes = {};

export default memo(WrapperHeight);
