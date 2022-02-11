/**
 *
 * Congratulation
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Background from 'images/group-4@3x.png';
import IconHuman from 'images/group-2@3x.png';
import './styles.less';
import { Button } from 'antd'
import { Link } from 'react-router-dom';

function Congratulation() {
  return (
    <div className="congratulation text-center">
      {/* <div className="w-default-570px"> */}
        <h3 className="congratulation-title mb-11px">
          <span className="primary-highlight">
            <FormattedMessage {...messages.congratulations} />
          </span>
          <FormattedMessage {...messages.done} />
        </h3>
        <div className="congratulation-image">
          <img src={Background} alt={`Background image`} className="cover-image"/>
          <img src={IconHuman} alt={`Icon image`} className="icon-human"/>
        </div>
        <div className="congratulation-content">
          <h3 className="congratulation-content__1"><FormattedMessage {...messages.content1} /></h3>
          <p className="congratulation-content__2"><FormattedMessage {...messages.content2} /></p>
        </div>
          <Button className="button-common">
            <Link to="/login">
              <FormattedMessage {...messages.login} />
            </Link>
          </Button>
      {/* </div> */}
    </div>
  );
}

Congratulation.propTypes = {};

export default memo(Congratulation);
