/**
 *
 * ButtonBack
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import IconBack from 'images/icons/icon-back@3x.png';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import './styles.less';

export function ButtonBack(props) {
  const { history, hasText = true, onClick } = props;

  const goBack = () => {
    history?.goBack();
  };

  return (
    <div className={`btn-back-link`} style={{...props.style}} onClick={history ? goBack : onClick}>
      <img src={IconBack} alt={'Back'} className={'btn-back-icon'} />
      <div className={'btn-back-text'}>
        {hasText && <FormattedMessage {...messages.back} />}
      </div>
    </div>
  );
}

ButtonBack.propTypes = {};

ButtonBack.defaultProps = {
  hasText: true,
};

export default memo(ButtonBack);
