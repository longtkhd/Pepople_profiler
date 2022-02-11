/**
 *
 * CustomProgress
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import './styles.less'

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function CustomProgress(props) {


  const { bgcolor, completed } = props;
  const containerStyles = {
    height: 30,
    width: '100%',
    backgroundColor: "#f4f6f9",


  }

  const fillerStyles = {
    height: '100%',
    width: `${completed * 10}%`,
    backgroundColor: bgcolor,
    textAlign: 'right',
  }

  const labelStyles = {
    padding: 10,
    color: 'white',
    fontWeight: 'bold',
    lineHeight: '30px'


  }
  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${completed}`}</span>
      </div>
    </div>
  );
}

CustomProgress.propTypes = {};

export default memo(CustomProgress);
