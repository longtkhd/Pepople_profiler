/**
 *
 * CloseButton
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import closeIcon from 'images/icons/invalid-name.png'


function CloseButton() {
  return (
    <div className={`btn-back-link`} >
      <img src={closeIcon} alt={'close'} className={'btn-back-icon'} />
      {/* <div className={'btn-back-text'}>
        {hasText && <FormattedMessage {...messages.back} />}
      </div> */}
    </div>
  );
}

CloseButton.propTypes = {};

export default memo(CloseButton);
