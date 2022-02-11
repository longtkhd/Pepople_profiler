/**
 *
 * AgencySetupDone
 *
 */

import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import HighlightText from 'components/atoms/HighlightText';
import { Button } from 'antd';

import './styles.less';
import PersonImage from 'images/icons/person.png';

import messages from './messages';
import globalMessages from 'messages';
import { FormattedMessage } from 'react-intl';

function AgencySetupDone() {
  return (
    <div className="agency-setup-done-container text-center">
      <div className="title">
        <HighlightText>
          <FormattedMessage {...messages.congratulation} />
        </HighlightText> &nbsp;
        <span>
          <FormattedMessage {...messages.allDone} />
        </span>
      </div>
      <div className="image mb-24">
        <div className="inline">
          <img src={PersonImage} />
          <div className="text bold-text">
            <div className="big-text">
              <FormattedMessage {...messages.enjoy} />
            </div>
            <div>
              <FormattedMessage {...messages.freeTrial} />
            </div>
          </div>
        </div>
      </div>
      <div className="description">
        <p>
          <FormattedMessage {...messages.description} />
        </p>
        <p>
          <FormattedMessage {...messages.thankYou} />
        </p>
      </div>
      <Link to="/">
        <Button type="primary" className="mt-24 done-button">
          <FormattedMessage {...globalMessages.continue} />
        </Button>
      </Link>
    </div>
  )
}

AgencySetupDone.propTypes = {};

export default memo(AgencySetupDone);
