/**
 *
 * CandidateFooter
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import './styles.less'

function CandidateFooter() {
  return (

    <div className="helper-links">
      {/*<a>Support </a><span style={{ color: 'white' }}> |</span>*/}
      {/*<a>Terms of Use </a><span style={{ color: 'white' }}>|</span>*/}
      {/*<a>Privacy</a>*/}
    </div>

  );
}

CandidateFooter.propTypes = {};

export default memo(CandidateFooter);
