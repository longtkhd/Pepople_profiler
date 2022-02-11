import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Row, Col } from 'antd';

const TitleField = (props) => {
  return (
    <div className="recruiter-head">
      <Row className={`recruiter-head-row`}>
          <div className="recruiter-title ">
            <FormattedMessage {...messages.contactName} />
          </div>

          <div className="recruiter-title ">
            <FormattedMessage {...messages.contactNumber} />
          </div>

          <div className="recruiter-title ">
            <FormattedMessage {...messages.email} />
          </div>

          <div className="recruiter-title ">
            <FormattedMessage {...messages.action} />
          </div>


      </Row>
    </div>
  )
}

export default TitleField
