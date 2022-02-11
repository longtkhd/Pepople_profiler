/**
 *
 * SpanCustom
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import './styles.less';

function SpanCustom(props) {
  
  return (
    <span className={props.className}> {props.children} </span>
  );
}

SpanCustom.propTypes = {};

SpanCustom.defaultProps = {
  hasText: true,
};

export default memo(SpanCustom);
