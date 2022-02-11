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

export function ButtonBackSteps(props) {
    const { onClick, hasText = true } = props;


    return (
        <div className={`btn-back-steps`} style={{ ...props.style }} onClick={onClick}>
            <img src={IconBack} alt={'Back'} className={'btn-back-icon'} />
            <div className={'btn-back-text'}>
                {hasText && <FormattedMessage {...messages.back} />}
            </div>
        </div>
    );
}

ButtonBackSteps.propTypes = {};

ButtonBackSteps.defaultProps = {
    hasText: true,
};

export default memo(ButtonBackSteps);
