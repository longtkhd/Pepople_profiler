/**
 *
 * Heading
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import './styles.less';

function Heading({ children, className }) {
  return <h2 className={`heading-2 ${className}`}>{children}</h2>
}

Heading.propTypes = {};

export default memo(Heading);
