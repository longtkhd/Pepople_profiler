/**
 *
 * RegisterLayout
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import WrapperLayout from 'components/layout/WrapperLayout';
import { Link } from 'react-router-dom';

import Logo from 'images/icons/logo.svg';
import './styles.less';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function RegisterLayout(props) {
  const { children, loading } = props;
  return (
    <WrapperLayout>
      <div className="register-layout">
        <div className="main-layout">
          <div className="logo">
            <Link to="/">
              <img src={Logo} />
            </Link>
          </div>
          <div className="main-content">
            {loading ? (
              <div className="spin-layout centered-layout">
                <Spin indicator={antIcon} />
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </WrapperLayout>
  );
}

RegisterLayout.propTypes = {
  loading: PropTypes.bool,
};

export default memo(RegisterLayout);
