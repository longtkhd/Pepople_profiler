/**
 *
 * Container
 *
 */

import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Typography, Descriptions } from 'antd';
import NumberFormat from 'react-number-format';
const { Title } = Typography;

import './styles.less';

function Statistics({ statistics, classNames, clientReview }) {
  const fontStyles = {
    color: classNames?.linkColor,
  };

  return (
    <Col lg={16} md={24} sm={24} xs={24} className={'statistic'}>
      <Row>
        <Col span={24} className={'Title'}>
          <Title level={1}>
            <span style={clientReview ? { color: '#32363e', fontWeight: '800' } : fontStyles}>
              {statistics?.contactName
                ? statistics?.contactName?.trim() + ', '
                : ''}
            </span>
            <span style={{ color: '#32363e', fontWeight: 500 }}>meet</span>
            &nbsp;
            <span style={clientReview ? { color: '#32363e', fontWeight: '800' } : fontStyles}>
              {statistics?.candidate_name || '{candidate_name}'}
            </span>
          </Title>
        </Col>
      </Row>

      <Row gutter={[16, 32]}>
        {statistics?.current_position && (
          <Col span={12}>
            <Descriptions layout="vertical" size="small">
              <Descriptions.Item label="Current Position">
                <Title
                  level={4}
                  className={'statistic-title'}
                  style={{ fontSize: '12px' }}
                >
                  {statistics.current_position}
                </Title>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        )}

        {statistics?.notice_period && (
          <Col span={12}>
            <Descriptions layout="vertical" size="small">
              <Descriptions.Item label="Notice Period">
                <Title level={4}>{statistics.notice_period}</Title>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        )}
      </Row>
      <Row gutter={[16, 32]}>
        {statistics?.current_employer && (
          <Col span={12}>
            <Descriptions layout="vertical" size="small">
              <Descriptions.Item label="Current Employer">
                <Title level={4}> {statistics?.current_employer}</Title>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        )}
        {statistics?.exp_rem && (
          <Col span={12}>
            <Descriptions layout="vertical" size="small">
              {statistics?.jobType === "Temp" ?
                <Descriptions.Item label={"Charge Rate"}>
                  <Title level={4}>
                    {statistics?.exp_rem}
                  </Title>
                </Descriptions.Item>
                : <Descriptions.Item label={"Expected Remuneration"}>
                  <Title level={4}>
                    <NumberFormat
                      placeholder=""
                      prefix="AUD $"
                      thousandSeparator={true}
                      displayType={'text'}
                      value={statistics?.exp_rem}
                    />
                  </Title>
                </Descriptions.Item>
              }
            </Descriptions>
          </Col>
        )}
      </Row>
    </Col>
  );
}

Statistics.propTypes = {};

export default memo(Statistics);
