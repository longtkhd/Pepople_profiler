/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 */

import React, { useMemo } from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import globalMessages from 'messages';

export default function NotFound({ location }) {

  const isNotBackHome = useMemo(() => {
    return location?.state?.isNotBackHome;
  }, [location?.state?.isNotBackHome]);

  return (
    <Result
      status="404"
      title={<FormattedMessage {...messages.title} />}
      subTitle={isNotBackHome ? <FormattedMessage {...messages.invitedContent} /> : <FormattedMessage {...messages.content} />}
      extra={
        isNotBackHome ? null :
        (<Link to="/">
          <Button type="primary">
            <FormattedMessage {...globalMessages.homePage} />
          </Button>
        </Link>)
      }
  />
  );
}
