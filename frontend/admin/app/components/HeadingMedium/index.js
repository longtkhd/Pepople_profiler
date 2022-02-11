/**
 *
 * HeadingMedium
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import './styles.less';

function HeadingMedium({ children, className}) {
  return (
    <h3 className={`heading-3 ${className ? className : ''}`}>
      {children}
    </h3>
  );
}

HeadingMedium.propTypes = {};

export default memo(HeadingMedium);
