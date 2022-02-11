/**
 *
 * StarRate
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Rate } from 'antd';
import './styles.less';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function StarRate({ disabled, value }) {
  return (
    <div className="rate-card">
      <span className={'your-rate'}>
        Your Rating
        <Rate
          value={value}
          disabled={disabled ? disabled : false}
          className={`star-rate`}
        />
      </span>
    </div>
  );
}

StarRate.propTypes = {};

export default memo(StarRate);
