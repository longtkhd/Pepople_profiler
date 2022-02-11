/**
 *
 * Footer
 *
 */

import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import './styles.less';

import messages from './messages';
import { FormattedMessage } from 'react-intl';

function Footer() {
  return (
    <div className="helper-links">
      <Link to="#">
       <FormattedMessage {...messages.support} />
      </Link>
      <span className="divider">|</span>
      <Link to="#">
       <FormattedMessage {...messages.faq} />
      </Link>
      <span className="divider">|</span>
      <Link to="#">
       <FormattedMessage {...messages.termOfUse} />
      </Link>
      <span className="divider">|</span>
      <Link to="#">
       <FormattedMessage {...messages.privacy} />
      </Link>
    </div>
  );
}

Footer.propTypes = {};

export default memo(Footer);
