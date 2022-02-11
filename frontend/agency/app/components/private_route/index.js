import React, { useEffect, memo } from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import updateServerNotification from 'containers/common_provider/update_server_notification/actions';

import { isValidToken, getUserInfo } from 'services/authentication';
import NotFoundPage from 'containers/not_found_page/loadable';
import { CONFIG } from 'constants/config';
import useSocket from 'use-socket.io-client';
const server = CONFIG.SERVER;

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isValid = isValidToken();
  const userInfo = getUserInfo();
  const userRole = userInfo?.role;
  const routeRoles = rest?.meta?.roles;
  const permit = routeRoles.indexOf(userRole) > -1;
  const path = rest?.path;
  const [socket] = useSocket(server);
  const { onUpdateServerNotification } = rest;

  useEffect(() => {
    if (isValid && permit) {
      socket.connect();
      socket.on('serverSendNotification', (data) => {
        onUpdateServerNotification(data);
      })
    }
    return () => {
      socket.disconnect();
    }
  }, [])

  return (
    <Route
      {...rest}
      render={
        props => {
          props.socket = socket;
          return (
            isValid ? (
              permit ? (
                path === "/" ? (
                  <Redirect to={userRole === "agency" ? "/recruiter-list" : "/job-list"} />
                ) : <Component {...props} />
              ) : <NotFoundPage />
            ) : (
              <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
              }}
              />
            )
          )
        }
      }
    />
  );
}

PrivateRoute.props = {
  onUpdateServerNotification : PropTypes.func,
}

function mapDispatchToProps(dispatch) {
  return {
    onUpdateServerNotification: notification => dispatch(updateServerNotification(notification))
  }
};

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(PrivateRoute);