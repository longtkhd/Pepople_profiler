/**
 *
 * Container
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Row, Col } from 'antd';
import BannerImage from 'images/HeaderCandidate/banner.png';

import './styles.less';
import { imageEncode } from 'utils/companyImageHelper';

function Banner({ children, image }) {
  const imageString = imageEncode(image); 
  return (
    <Row>
      <Col span={24}>
        <div className="banner">
          <img src={image ? imageString : BannerImage} alt="banner" className={'banner-image'} />
        </div>
      </Col>
    </Row>
  );
}

Banner.propTypes = {};

export default memo(Banner);
