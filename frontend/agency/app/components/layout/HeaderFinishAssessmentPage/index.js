/**
 *
 * HeaderFinishAssessmentPage
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';

import Logo from 'components/Logo';
import BackgroundHeader from 'images/rectangle-path-2-copy-mask.png';
import styled from 'styled-components';
import './styles.less';

const WrapperHeader = styled.header`
  background: url(${({ cover }) => (cover ? cover : '#3abcca')});
  background-repeat: no-repeat;
  background-size: 100% 100%;
`;

function HeaderFinishAssessmentPage() {
  return (
    <WrapperHeader
      className="header finish-assessment"
      cover={BackgroundHeader}
    >
      <div className="header-item">
        <div className="header-logo text-center">
          <Link to="/" className="logo-link">
            <Logo />
          </Link>
        </div>
      </div>
    </WrapperHeader>
  );
}

export default HeaderFinishAssessmentPage;
