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
import WrapperHeight from 'components/layout/WrapperHeight'

import Logo from 'components/Logo';
import './styles.less';
import Footer from '../Footer'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function RegisterLayout(props) {
  const { children, loading } = props;
  return (
    <WrapperHeight>
      <WrapperLayout>
        <div className="register-layout">
          <div className="main-register-layout">
            <div className="register-logo">
              <Link to="/" className="logo-link">
                <Logo />
              </Link>
            </div>
            <div className="main-content">
              {loading ? (
                <div className="spin-layout centered-layout">
                  <Spin indicator={antIcon} />
                </div>
              ) : children}
            </div>
          </div>
        </div>
        {props?.showFooter && (
          <div className={`${props.className}`}>
            <Footer />
          </div>
        )}

      </WrapperLayout>
    </WrapperHeight>
  );
}

RegisterLayout.propTypes = {
  loading: PropTypes.bool,
};

export default memo(RegisterLayout);
