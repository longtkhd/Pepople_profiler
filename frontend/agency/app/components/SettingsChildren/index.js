/**
 *
 * SettingsChildren
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import SectionWrapper from 'components/SectionWrapper';
import Container from 'components/Container'
import { Typography } from 'antd';

const { Title } = Typography;

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import './styles.less'

function SettingsChildren(props) {
  return (
    <Container>
      <div className="margin-wrapper">
        <SectionWrapper className="section-setting">
          <div className="body-setting">
            <div className="icon-setting">
              {props.icon}
            </div>
            <div className="title">
              <Title level={5}>{props.children}</Title>
            </div>
            <div className="button-manage">
              {props.button}
            </div>

          </div>

        </SectionWrapper>
      </div>
    </Container>

  );
}

SettingsChildren.propTypes = {};

export default memo(SettingsChildren);
