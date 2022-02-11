/**
 *
 * FooterClient
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
// import { Link } from 'react-router-dom';
import messages from './messages';
import './styles.less';
import styled from 'styled-components';

const Link = styled.a`
  color: #333333 !important;
`;

function FooterClient({ fontColor }) {
  return (
    <div className="footer-client">
      <div className="sent-people">
        <span className="head-footer">
          {/*Sent using{' '}*/}
          {/*<a href="www.peopleprofiler.com.au" target="_blank">*/}
          {/*  www.peopleprofiler.com.au*/}
          {/*</a>*/}
        </span>
      </div>

      <div className="helper-links" style={{ backgroundColor: fontColor || '#ffffff'}}>
        {/*<Link*/}
        {/*  href="#"*/}
        {/*>*/}
        {/*  <FormattedMessage {...messages.support} />*/}
        {/*</Link>*/}
        {/*<span className="divider">|</span>*/}
        {/*<Link*/}
        {/*  href="#"*/}
        {/*>*/}
        {/*  <FormattedMessage {...messages.faq} />*/}
        {/*</Link>*/}
        {/*<span className="divider">|</span>*/}
        {/*<Link*/}
        {/*  href="#"*/}
        {/*>*/}
        {/*  <FormattedMessage {...messages.termOfUse} />*/}
        {/*</Link>*/}
        {/*<span className="divider">|</span>*/}
        {/*<Link*/}
        {/*  href="#"*/}
        {/*>*/}
        {/*  <FormattedMessage {...messages.privacy} />*/}
        {/*</Link>*/}
      </div>
    </div>
  );
}

FooterClient.propTypes = {
  fontColor: PropTypes.string,
};

export default memo(FooterClient);
