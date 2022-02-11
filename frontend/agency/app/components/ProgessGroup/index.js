/**
 *
 * ProgessGroup
 *
 */

import React, { memo } from 'react';

import PropTypes from 'prop-types';

import { Progress, Row, Col, Typography } from 'antd';

import CustomProgress from 'components/CustomProgress';
import './styles.less';

const { Title } = Typography;

function ProgessGroup(props) {
  const {data, name, rate} = props;

  const handleSetVote = (vote) => {
    let text = '';
    switch (vote) {
      case 1:
        text = 'Very Low';
        break;
      case 2:
        text = 'Very Low';
        break;
      case 3:
        text = 'Very Low';
        break;
      case 4:
        text = 'Fairly Low';
        break;
      case 5:
        text = 'Average';
        break;
      case 6:
        text = 'Average';
        break;
      case 7:
        text = 'High';
        break;
      case 8:
        text = 'High';
        break;
      case 9:
        text = 'Very Hight';
        break;
      case 10:
        text = 'Extremely High';
        break;
      default:
        text = '';
        break;
    }
    return text;
  }

  return (
    <>
      <Row justify="center" align="middle">
        <Title className="text-center" style={{ padding: '30px 0' }}>
          Abilites
        </Title>
      </Row>

      <Row justify="center" align="left">
        <Col lg={24} md={24} sm={24} xs={24} xl={23} className={'bar-chart '}>
          <div className={'progess'}>
            {data.map(x => (
              <Row style={{ padding: '20px 0' }} key={x[name]}>
                <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                  {x[name]}
                </Col>
                <Col
                  xl={14}
                  lg={13}
                  md={13}
                  sm={24}
                  xs={24}
                  className="process--box"
                >
                  <CustomProgress
                    bgcolor={props.bgColor ? props.bgColor : '#3abcca'}
                    completed={x[rate]}
                  />
                </Col>
                <Col xl={4} lg={5} md={5} sm={24} xs={24}>
                  {handleSetVote(x[rate])}
                </Col>
              </Row>
            ))}
          </div>
        </Col>
      </Row>
    </>
  );
}

ProgessGroup.propTypes = {
    data: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    rate: PropTypes.string.isRequired,
};

export default memo(ProgessGroup);
