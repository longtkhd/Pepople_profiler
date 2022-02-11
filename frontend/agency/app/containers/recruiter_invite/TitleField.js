import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Row, Col } from 'antd';

const TitleField = props => {
  return (
    <Row
      gutter={[32, 0]}
      justify="space-between"
      align="center"
      className={`recruiter-title`}
    >
      {props.fieldName?.map((name, index) => {
        return index === 3 || index === 4 ? (
            <Col xs={12} sm={5} md={5} xl={5} xxl={5} key={index}>
              {name}
            </Col>
          ) : (
            <Col xs={12} sm={4} md={4} xl={4} xxl={4} key={index}>
              {name}
            </Col>
          )
        })}
    </Row>
  );
};

export default TitleField;
// sm={5} md={5} xl={5} xxl={5}
