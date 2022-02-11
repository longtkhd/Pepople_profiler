/**
 *
 * CardActivity
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import './styles.less';
import messages from './messages';
import Title from 'components/atoms/Title';
import { Row, Col } from 'antd';
import icon1 from 'images/Client/document.png';
import icon2 from 'images/Client/invalid1-name.png';
import icon3 from 'images/Client/invalid2-name.png';
import icon4 from 'images/Client/invalid6-name.png';
import icon5 from 'images/Client/invalid4-name.png';
import icon6 from 'images/Client/group-4.png';
import icon7 from 'images/Client/invalid5-name.png';
function CardActivity(props) {
  const { value, icon, title, description } = props;

  const arrayIcon = [
    icon1,
    icon2,
    icon3,
    icon4,
    icon5,
    icon6,
    icon7
  ]

  const mapTitle = title instanceof Object ? `Male | Female` : title;
  const mapValue = value instanceof Object ? `${value?.male} | ${value?.female}` : value;

  return (
    <div className="activity-card">
      <Row justify="space-between">
        <Col xs={24} xl={18} lg={18} sm={18} className="pd-15">
          <Row>
            <Col className="secondary-title">
              <span
                className='title'
                style={{ color: '#6893ff' }}
              >
                {mapValue}
              </span>

              {/* <Title style={{ color: 'red' }}>{mapValue}</Title> */}
            </Col>
          </Row>
          <Row className="subtitle">
            <Col xl={18}>{mapTitle}</Col>
          </Row>
        </Col>

        <Col
          style={{ padding: '20px 0', textAlign: 'center' }}
          xs={4}
          xl={6}
          lg={6}
          sm={6}
        >
          <img src={arrayIcon[icon]} alt="" style={{width: '66px', height: '66px', marginRight: '10px'}}/>
        </Col>
      </Row>
      <Row className="pd-15">{description}</Row>
    </div>
  );
}

CardActivity.propTypes = {};

export default memo(CardActivity);
