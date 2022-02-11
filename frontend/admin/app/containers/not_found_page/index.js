/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 */

import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import globalMessages from 'messages';

export default function NotFound() {
  return (
    <Result
      status="404"
      title={<FormattedMessage {...messages.title} />}
      subTitle={<FormattedMessage {...messages.content} />}
      extra={
        <Link to="/">
          <Button type="primary">
            <FormattedMessage {...globalMessages.homePage} />
          </Button>
        </Link>
      }
  />
  );
}
