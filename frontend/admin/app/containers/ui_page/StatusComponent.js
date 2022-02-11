import React, { memo } from 'react';
import { Row, Col } from 'antd';
import SectionWrapper from 'components/SectionWrapper';
import Status from 'components/Status/loadable';


const StatusComponent = ({ title }) => {
  return (
    <SectionWrapper heading={title}>
      <Row gutter={[8,8]}>
        <Col>
          <Status type="progress" />
        </Col>
        <Col>
          <Status type="submitted" />
        </Col>
        <Col>
          <Status type="received" />
        </Col>
        <Col>
          <Status type="closed" />
        </Col>
        <Col>
          <Status type="successful" />
        </Col>
        <Col>
          <Status type="missing" />
        </Col>
        <Col>
          <Status type="inviteYet" />
        </Col>
        <Col>
          <Status type="completed" />
        </Col>
        <Col>
          <Status type="invited" />
        </Col>
      </Row>
    </SectionWrapper>
  )
}

export default memo(StatusComponent);
