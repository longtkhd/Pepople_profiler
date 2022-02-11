import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isValidToken, getUserInfo } from 'services/authentication';
import NotFoundPage from 'containers/not_found_page/loadable';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isValid = isValidToken();
  const userInfo = getUserInfo();
  const userRole = userInfo?.role;
  const routeRoles = rest?.meta?.roles;
  const permit = routeRoles.indexOf(userRole) > -1;
  const path = rest?.path;

  return (
    <Route
      {...rest}
      render={
        props => {
          return (
            isValid ? (
              permit ? (
                path === "/" ? (
                  <Redirect to={userRole === "admin" ? "/dashboard-page" : "/job-list"} />
                ) : <Component {...props} />
              ) : <NotFoundPage />
            ) : (
                <Redirect to={{
                  pathname: '/admin/login',
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

export default PrivateRoute;
