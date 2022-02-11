import React, { memo } from 'react';
import { Row, Col } from 'antd';
import Button from 'components/atoms/Button';
import Heading from 'components/Heading';
import SectionWrapper from 'components/SectionWrapper';
import { UploadOutlined } from '@ant-design/icons';


const ButtonComponent = ({ title }) => {
  return (
    <SectionWrapper heading={title}>
      <Row gutter={[8,8]}>
        <Col>
          <Button className="btn-default-outline">
            {'Default'}
          </Button>
        </Col>
        <Col>
          <Button className="btn-secondary-outline">
            {'Default'}
          </Button>
        </Col>
        <Col>
          <Button className="btn-danger">
            {'Danger'}
          </Button>
        </Col>
        <Col>
          <Button className="btn-primary">
            {'Primary'}
          </Button>
        </Col>
        <Col>
          <Button className="btn-primary-gradient">
            {'Primary Gradient'}
          </Button>
        </Col>
        <Col>
          <Button className="btn-default-outline">
          <UploadOutlined className="btn-icon" /> {'Upload from compouter'}
          </Button>
        </Col>
        <Col>
          <Button className="btn-default-outline">
            {'Default'}
          </Button>
        </Col>
      </Row>
    </SectionWrapper>
  )
}

export default memo(ButtonComponent);
