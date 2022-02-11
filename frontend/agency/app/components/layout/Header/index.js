/**
 *
 * Header
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import getUserDefault from 'containers/common_provider/get_user_info/actions';
import getAgencyInfo from 'containers/common_provider/get_agency_info/actions';
import { makeSelectAgencyInfo } from 'containers/common_provider/get_agency_info/selectors';
import { makeSelectUserInfo } from 'containers/common_provider/get_user_info/selectors';
import { makeSelectUpdateUserSuccess } from 'containers/common_provider/update_user_profile/selectors';
import { getUserInfo } from 'services/authentication';

import messages from './messages';
import Logo from 'components/Logo';
import BackgroundHeader from 'images/rectangle-path-2-copy-mask.png';
import styled from 'styled-components';
import Nav from './Nav';
import './styles.less';

const WrapperHeader = styled.header`
  background: url(${({ cover }) => (cover ? cover : '#3abcca')});
  background-repeat: no-repeat;
  background-size: 100% 100%;
`;

function Header(props) {
  const { 
    agencyInfo, 
    getAgency, 
    users, 
    onGetUser, 
    updateUserResponse
  } = props;
  const defaultUserInfo = getUserInfo();
  const agencyId = defaultUserInfo?.agency_id;
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (users) {
      setUserInfo(users);
    }
  }, [users]);

  useEffect(() => {
    if (updateUserResponse) {
      onGetUser();
    }
    return () => {};
  }, [updateUserResponse]);

  useEffect(() => {
    onGetUser();
    getAgency(agencyId);
    return () => { }
  }, [])

  return (
    <WrapperHeader className="header" cover={BackgroundHeader}>
      <div className="header-item">
        <div className="text-welcome">
          <span className="color-blur"><FormattedMessage {...messages.welcomeText} /></span>
          <span className="fw-800">{`${userInfo?.first_name || ''} ${userInfo?.last_name || ''} `}</span>
          <span className="color-blur"><FormattedMessage {...messages.fromText} /></span>
          <span className="fw-800">{` ${agencyInfo?.agency_name || ''}`}</span>
        </div>
      </div>
      <div className="header-item">
        <div className="header-logo text-center">
          <Link to="/" className="logo-link">
            <Logo />
          </Link>
        </div>
      </div>
      <div className="header-item">
        <Nav />
      </div>
    </WrapperHeader>
  );
}

Header.propTypes = {
  getAgency: PropTypes.func,
  updateUserResponse: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  agencyInfo: makeSelectAgencyInfo(),
  users: makeSelectUserInfo(),
  updateUserResponse: makeSelectUpdateUserSuccess(),
});

function mapDispatchToProps(dispatch) {
  return {
    getAgency: agencyId => dispatch(getAgencyInfo(agencyId)),
    onGetUser: () => dispatch(getUserDefault()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(Header);
