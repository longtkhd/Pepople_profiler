/**
 *
 * ButtonClose
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import CloseIcon from 'images/icons/invalid-name-9/invalid-name.png';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import './styles.less';

function ButtonClose(props) {

  return (

    
    <div className="btn-close-link">
      <img
        src={CloseIcon}
        alt={'Close'}
        className={'btn-close-icon'}
        style={{ mixBlendMode: 'difference' }}
        onClick={props.onClick}
      />
      <div className={'btn-close-text'} style={{ mixBlendMode: 'difference' }} onClick={props.onClick}>
        <FormattedMessage {...messages.close} />
      </div>
    </div>
  );
}

ButtonClose.propTypes = {};

export default memo(ButtonClose);
