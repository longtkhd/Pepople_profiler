/**
 *
 * CandidateHeader
 *
 */

import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styled from 'styled-components';
import BackgroundHeader from 'images/HeaderCandidate/rectangle-path-2-copy-mask.png';
import './styles.less';
import ButtonClose from 'components/ButtonClose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Logo from 'components/Logo';

// const WrapperHeader = styled.header`
//   background: url(${({ cover }) => (cover ? cover : '#3abcca')});
//   background-repeat: no-repeat;
//   background-size: 100% 100%;
// `;

const WrapperHeader = styled.header`
  background: ${({ cover }) => (cover ? cover : '#3abcca')};
`;

function CandidateHeader(props) {
  const { history, userInfo, logo, color } = props;

  const handleClose = () => {
    if(!history) return;
    history.goBack()
  }
  
  return (
    <WrapperHeader className="header candidate-header" cover={color}>
      <div className="header-item">
        <div className="text-welcome">
          <FormattedMessage {...messages.welcomeText} />
          <span className="bold-text">{`${userInfo?.firstname} ${
            userInfo?.lastname
          } `}</span>
          <FormattedMessage {...messages.fromText} />
          <span className="bold-text">{` ${userInfo?.agency_name}`}</span>
        </div>
      </div>
      <div className="header-item">
        <div className="header-logo text-center">
          <Link to="/" className="logo-link">
            <Logo logo={logo}/>
          </Link>
        </div>
      </div>
      <div className="header-item close-icon">
        <ButtonClose onClick={handleClose}/>
      </div>
    </WrapperHeader>
  );
}

CandidateHeader.propTypes = {};
const mapStateToProps = createStructuredSelector({
  // agencyInfo: makeSelectAgencyInfo(),
  // users: makeSelectUserInfo(),
  // updateUserResponse: makeSelectUpdateUserSuccess(),
});

function mapDispatchToProps(dispatch) {
  return {
    // getAgency: agencyId => dispatch(getAgencyInfo(agencyId)),
    // onGetUser: () => dispatch(getUserDefault()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CandidateHeader);
