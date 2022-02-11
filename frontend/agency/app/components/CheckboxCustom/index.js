/**
 *
 * CheckboxCustom
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Checkbox } from 'antd';
import './styles.less'

function CheckboxCustom(props) {
  const { label } = props;
  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  }
  return (
    <Checkbox onChange={onChange}> {label}</Checkbox>
  );
}

CheckboxCustom.propTypes = {};

export default memo(CheckboxCustom);
