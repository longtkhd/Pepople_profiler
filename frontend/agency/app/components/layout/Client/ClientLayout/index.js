/**
 *
 * ClientLayout
 *
 */

import React, { memo } from 'react';

import { FormattedMessage } from 'react-intl';
import HeaderClient from 'components/layout/Client/HeaderClient'
import FooterClient from 'components/layout/Client/FooterClient'
import './styles.less'
import { Spin } from 'antd';

function ClientLayout(props) {
  const {
    loading,
    children,
    jobType
  } = props;
  return (
    <div className="client-layout" style={{ ...props?.mainLayoutStyles }}>
      <header className="layout-header">
        <HeaderClient jobType={jobType} logo={props?.logo} history={props?.history} inviteToken={props?.inviteToken} fontColor={props?.fontColor} />
      </header>
      <main className="content" style={{ ...props.contentStyles }}>
        {loading ? (
          <div className="spin-layout centered-layout">
            <Spin />
          </div>
        ) : children}
      </main>
      <footer className="layout-footer">
        <FooterClient fontColor={props?.fontColor}/>
      </footer>
    </div>
  );
}

ClientLayout.propTypes = {};

export default memo(ClientLayout);
